import { PRODUCTS } from '../data/catalog'
import { getSourcePrices } from './priceEngine'

const DEFAULT_SEARCH_ENDPOINT = '/search'

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

export function buildCatalogIndex(products) {
  return Object.fromEntries(products.map(product => [product.id, product]))
}

export function buildPriceMap(products) {
  return Object.fromEntries(products.map(product => [product.id, getSourcePrices(product.id, product.base)]))
}

export function getSearchModeLabel(mode) {
  return mode === 'remote' ? 'API real' : 'dados simulados'
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

  const ql = term.toLowerCase()
  const products = PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(ql) ||
    product.cat.toLowerCase().includes(ql) ||
    product.brand.toLowerCase().includes(ql)
  )

  return { products, mode: 'local' }
}