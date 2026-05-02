import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar'
import Toast from './components/Toast'
import { useStore } from './hooks/useStore'
import { useToast } from './hooks/useToast'
import { PRODUCTS, SOURCES } from './data/catalog'
import {
  buildCatalogIndex,
  buildPriceMap,
  searchProducts,
} from './utils/marketData'

const SearchPage = lazy(() => import('./pages/SearchPage'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))
const AlertsPage = lazy(() => import('./pages/AlertsPage'))
const ApiStatsPage = lazy(() => import('./pages/ApiStatsPage'))

const CATALOG_CACHE_KEY = 'pr_catalog_cache'

function loadCatalogCache() {
  try {
    const raw = localStorage.getItem(CATALOG_CACHE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const DEFAULT_CATALOG = {
  ...buildCatalogIndex(PRODUCTS),
  ...loadCatalogCache(),
}
const DEFAULT_PRICE_MAP = buildPriceMap(Object.values(DEFAULT_CATALOG))

export default function App() {
  const [view, setView]               = useState('search')      // 'search' | 'product' | 'favorites' | 'alerts' | 'api-stats'
  const [selectedProduct, setProduct] = useState(null)
  const [query, setQuery]             = useState('')
  const [results, setResults]         = useState([])
  const [searching, setSearching]     = useState(false)
  const [loadProgress, setLoadProgress] = useState({})
  const [hasSearched, setHasSearched] = useState(false)
  const [searchMode, setSearchMode]   = useState('local')
  const [catalogById, setCatalogById]  = useState(DEFAULT_CATALOG)
  const [priceMap, setPriceMap]       = useState(DEFAULT_PRICE_MAP)
  const searchRef = useRef(null)
  const searchRequestRef = useRef(0)

  const store  = useStore()
  const toastFn = useToast()

  useEffect(() => {
    try {
      localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(catalogById))
    } catch {
      // Ignore storage quota and privacy-mode errors.
    }
  }, [catalogById])

  // ── Search ──────────────────────────────────────────────────
  async function doSearch(term) {
    const q = (term ?? query).trim()
    if (!q) return

    const requestId = ++searchRequestRef.current

    setQuery(q)
    setSearching(true)
    setHasSearched(true)
    setLoadProgress({})
    setView('search')
    setProduct(null)

    const progressPromise = (async () => {
      for (let i = 0; i < SOURCES.length; i++) {
        await new Promise(r => setTimeout(r, 180 + i * 170))
        if (requestId !== searchRequestRef.current) return false
        setLoadProgress(prev => ({ ...prev, [SOURCES[i].id]: true }))
      }

      await new Promise(r => setTimeout(r, 200))
      return requestId === searchRequestRef.current
    })()

    const searchPromise = searchProducts(q)

    const [progressReady, searchResult] = await Promise.all([progressPromise, searchPromise])
    if (requestId !== searchRequestRef.current || !progressReady) return

    const found = searchResult.products
    const mergedCatalog = buildCatalogIndex(found)
    const mergedPrices = buildPriceMap(found)

    setCatalogById(prev => ({ ...prev, ...mergedCatalog }))
    setPriceMap(prev => ({ ...prev, ...mergedPrices }))
    setSearchMode(searchResult.mode)
    setResults(found)
    setSearching(false)
    store.incrementApiCalls(searchResult.mode === 'remote' ? 1 : SOURCES.length)

    if (!found.length) toastFn.show('Nenhum produto encontrado', '🔭')
  }

  // ── Navigation ───────────────────────────────────────────────
  function navigate(v) {
    setView(v)
    setProduct(null)
  }

  function openProduct(product) {
    setProduct(product)
    setView('product')
  }

  // ── Favorites ────────────────────────────────────────────────
  function handleToggleFav(id) {
    const had = store.favorites.includes(id)
    store.toggleFavorite(id)
    toastFn.show(had ? 'Removido dos favoritos' : 'Adicionado aos favoritos', had ? '💔' : '❤️')
  }

  // ── Alerts ───────────────────────────────────────────────────
  function handleAddAlert(product, targetPrice) {
    store.addAlert(product, targetPrice)
    toastFn.show(`Alerta criado para R$ ${targetPrice.toLocaleString('pt-BR')}`, '🔔')
  }

  function handleDeleteAlert(id) {
    store.deleteAlert(id)
    toastFn.show('Alerta removido', '🗑️')
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="app-shell" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        view={view}
        favCount={store.favorites.length}
        alertCount={store.alerts.filter(a => a.active).length}
        apiCalls={store.apiCalls}
        sourceCount={SOURCES.length}
        onNavigate={navigate}
      />

      <div className="app-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Topbar */}
        <div className="app-topbar" style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: 'rgba(7,7,15,.92)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--bord)',
          padding: '10px 20px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'var(--muted)' }}>🔍</span>
            <input
              ref={searchRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
              aria-label="Buscar produto, marca ou categoria"
              placeholder="Buscar produto, marca ou categoria..."
              disabled={searching}
              style={{
                width: '100%', background: 'var(--surf)',
                border: '1px solid var(--bord)', borderRadius: 7,
                padding: '8px 12px 8px 34px', fontSize: 13,
                color: 'var(--text)', fontFamily: 'DM Sans',
                transition: 'border-color .15s', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--amber)'}
              onBlur={e => e.target.style.borderColor = 'var(--bord)'}
            />
          </div>
          <button
            onClick={() => doSearch()}
            disabled={searching}
            aria-label="Executar busca"
            style={{
              background: 'var(--amber)', color: 'var(--bg)', border: 'none',
              padding: '8px 14px', borderRadius: 7, fontSize: 12.5, fontWeight: 600,
              cursor: searching ? 'not-allowed' : 'pointer',
              opacity: searching ? 0.5 : 1, fontFamily: 'DM Sans',
              whiteSpace: 'nowrap', transition: 'opacity .15s',
            }}
          >
            {searching ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {/* Main content */}
        <div className="app-content" style={{ padding: 20, flex: 1 }}>
          <Suspense fallback={<div className="page-loading">Carregando painel...</div>}>
            {view === 'search' && (
              <SearchPage
                results={results}
                searching={searching}
                hasSearched={hasSearched}
                loadingProgress={loadProgress}
                searchMode={searchMode}
                favorites={store.favorites}
                allPrices={priceMap}
                onOpenProduct={openProduct}
                onQuickSearch={term => { setQuery(term); doSearch(term) }}
              />
            )}

            {view === 'product' && selectedProduct && (
              <ProductPage
                product={selectedProduct}
                favorites={store.favorites}
                onToggleFavorite={handleToggleFav}
                onAddAlert={handleAddAlert}
                onBack={() => setView('search')}
              />
            )}

            {view === 'favorites' && (
              <FavoritesPage
                favorites={store.favorites}
                catalogById={catalogById}
                onOpenProduct={p => openProduct(p)}
                onRemoveFavorite={id => handleToggleFav(id)}
              />
            )}

            {view === 'alerts' && (
              <AlertsPage
                alerts={store.alerts}
                allPrices={priceMap}
                onDeleteAlert={handleDeleteAlert}
              />
            )}

            {view === 'api-stats' && (
              <ApiStatsPage apiCalls={store.apiCalls} sourceCount={SOURCES.length} />
            )}
          </Suspense>
        </div>
      </div>

      <Toast toast={toastFn.toast} />
    </div>
  )
}
