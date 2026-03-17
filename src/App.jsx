import React, { useState, useMemo, useRef } from 'react'
import Sidebar from './components/Sidebar'
import Toast from './components/Toast'
import SearchPage from './pages/SearchPage'
import ProductPage from './pages/ProductPage'
import FavoritesPage from './pages/FavoritesPage'
import AlertsPage from './pages/AlertsPage'
import ApiStatsPage from './pages/ApiStatsPage'
import { useStore } from './hooks/useStore'
import { useToast } from './hooks/useToast'
import { PRODUCTS, SOURCES } from './data/catalog'
import { getSourcePrices } from './utils/priceEngine'

// Pre-compute all prices once (stable between renders)
const ALL_PRICES = Object.fromEntries(
  PRODUCTS.map(p => [p.id, getSourcePrices(p.id, p.base)])
)

export default function App() {
  const [view, setView]               = useState('search')      // 'search' | 'product' | 'favorites' | 'alerts' | 'api-stats'
  const [selectedProduct, setProduct] = useState(null)
  const [query, setQuery]             = useState('')
  const [results, setResults]         = useState([])
  const [searching, setSearching]     = useState(false)
  const [loadProgress, setLoadProgress] = useState({})
  const [hasSearched, setHasSearched] = useState(false)
  const searchRef = useRef(null)

  const store  = useStore()
  const toastFn = useToast()

  // ── Search ──────────────────────────────────────────────────
  async function doSearch(term) {
    const q = (term ?? query).trim()
    if (!q) return

    setQuery(q)
    setSearching(true)
    setHasSearched(true)
    setLoadProgress({})
    setView('search')
    setProduct(null)

    // Simulate staggered API calls
    for (let i = 0; i < SOURCES.length; i++) {
      await new Promise(r => setTimeout(r, 180 + i * 170))
      setLoadProgress(prev => ({ ...prev, [SOURCES[i].id]: true }))
    }

    await new Promise(r => setTimeout(r, 200))

    const ql = q.toLowerCase()
    const found = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(ql) ||
      p.cat.toLowerCase().includes(ql)  ||
      p.brand.toLowerCase().includes(ql)
    )
    setResults(found)
    setSearching(false)
    store.incrementApiCalls(SOURCES.length)

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
  function handleAddAlert(product, targetPrice, currentPrice) {
    store.addAlert(product, targetPrice, currentPrice)
    toastFn.show(`Alerta criado para R$ ${targetPrice.toLocaleString('pt-BR')}`, '🔔')
  }

  function handleDeleteAlert(id) {
    store.deleteAlert(id)
    toastFn.show('Alerta removido', '🗑️')
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        view={view}
        favCount={store.favorites.length}
        alertCount={store.alerts.filter(a => a.active).length}
        apiCalls={store.apiCalls}
        onNavigate={navigate}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Topbar */}
        <div style={{
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
              placeholder="Buscar produto, marca ou categoria..."
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
        <div style={{ padding: 20, flex: 1 }}>
          {view === 'search' && (
            <SearchPage
              results={results}
              searching={searching}
              hasSearched={hasSearched}
              loadingProgress={loadProgress}
              favorites={store.favorites}
              allPrices={ALL_PRICES}
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
              onOpenProduct={p => openProduct(p)}
              onRemoveFavorite={id => handleToggleFav(id)}
            />
          )}

          {view === 'alerts' && (
            <AlertsPage
              alerts={store.alerts}
              onDeleteAlert={handleDeleteAlert}
            />
          )}

          {view === 'api-stats' && (
            <ApiStatsPage apiCalls={store.apiCalls} />
          )}
        </div>
      </div>

      <Toast toast={toastFn.toast} />
    </div>
  )
}
