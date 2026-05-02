import { PRODUCTS } from '../data/catalog'
import { getSourcePrices } from './priceEngine'

const DEFAULT_SEARCH_ENDPOINT = '/search'
const DEFAULT_PROVIDER = 'mercado-livre'

function normalizeProductId(rawId, fallbackKey) {
  if (typeof rawId === 'number' && Number.isFinite(rawId)) return rawId

  const numericId = Number(rawId)
  if (Number.isFinite(numericId)) return numericId

  const text = String(rawId ?? fallbackKey ?? '')
  let hash = 0

  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) % 2147483647
  }

  return hash || Date.now()
}

function normalizeRemoteProduct(item, fallbackKey) {
  if (!item || typeof item !== 'object') return null

  const name = typeof item.name === 'string' ? item.name.trim() : ''
  const price = Number(item.base ?? item.price ?? item.currentPrice ?? item.listPrice)

  if (!name || !Number.isFinite(price) || price <= 0) return null

  return {
    id: normalizeProductId(item.id ?? item.sku ?? item.code, fallbackKey),
    name,
    cat: typeof item.cat === 'string' ? item.cat : typeof item.category === 'string' ? item.category : 'Produtos',
    emoji: typeof item.emoji === 'string' ? item.emoji : '🛍️',
    base: Math.round(price),
    brand: typeof item.brand === 'string' ? item.brand : typeof item.marca === 'string' ? item.marca : 'Parceiro',
    link: typeof item.link === 'string' ? item.link : undefined,
    thumbnail: typeof item.thumbnail === 'string' ? item.thumbnail : undefined,
    sourceHint: typeof item.source === 'string' ? item.source : 'remote',
  }
}

function readRemoteItems(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.products)) return payload.products
  if (Array.isArray(payload?.items)) return payload.items
  return []
}

function normalizeMercadoLivreProduct(item, fallbackKey) {
  if (!item || typeof item !== 'object') return null

  const name = typeof item.title === 'string' ? item.title.trim() : ''
  const price = Number(item.price)

  if (!name || !Number.isFinite(price) || price <= 0) return null

  return {
    id: normalizeProductId(item.id ?? item.permalink ?? item.title, fallbackKey),
    name,
    cat: typeof item.category_id === 'string' ? item.category_id : 'Produtos',
    emoji: '🛍️',
    base: Math.round(price),
    brand: typeof item.seller?.nickname === 'string' ? item.seller.nickname : 'Mercado Livre',
    link: typeof item.permalink === 'string' ? item.permalink : undefined,
    thumbnail: typeof item.thumbnail === 'string' ? item.thumbnail : undefined,
    sourceHint: 'mercado-livre',
  }
}

export function buildCatalogIndex(products) {
  return Object.fromEntries(products.map(product => [product.id, product]))
}

export function buildPriceMap(products) {
  return Object.fromEntries(products.map(product => [product.id, getSourcePrices(product.id, product.base)]))
}

export function getSearchModeLabel(mode) {
  if (mode === 'remote') return 'API real'
  if (mode === DEFAULT_PROVIDER) return 'Mercado Livre'
  return 'dados simulados'
}

export async function searchProducts(query) {
  const term = query.trim()
  if (!term) {
    return { products: [], mode: 'local' }
  }

  const apiBase = import.meta.env.VITE_PRICERADAR_API_BASE?.trim()
  const endpoint = import.meta.env.VITE_PRICERADAR_SEARCH_ENDPOINT?.trim() || DEFAULT_SEARCH_ENDPOINT

  if (apiBase) {
    try {
      const url = new URL(endpoint, apiBase)
      url.searchParams.set('q', term)

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`search API returned ${response.status}`)
      }

      const payload = await response.json()
      const products = readRemoteItems(payload)
        .map((item, index) => normalizeRemoteProduct(item, `${term}-${index}`))
        .filter(Boolean)

      if (products.length > 0) {
        return { products, mode: 'remote' }
      }
    } catch {
      // Fall back to the built-in catalog when the remote gateway is unavailable.
    }
  }

  try {
    const url = new URL('https://api.mercadolibre.com/sites/MLB/search')
    url.searchParams.set('q', term)

    const response = await fetch(url)
    if (response.ok) {
      const payload = await response.json()
      const products = readRemoteItems(payload)
        .map((item, index) => normalizeMercadoLivreProduct(item, `${term}-ml-${index}`))
        .filter(Boolean)

      if (products.length > 0) {
        return { products, mode: DEFAULT_PROVIDER }
      }
    }
  } catch {
    // Keep falling back to the local catalog if the public API is unreachable.
  }

  const ql = term.toLowerCase()
  const products = PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(ql) ||
    product.cat.toLowerCase().includes(ql) ||
    product.brand.toLowerCase().includes(ql)
  )

  return { products, mode: 'local' }
}