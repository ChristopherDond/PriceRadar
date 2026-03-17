import React from 'react'
import ProductCard from '../components/ProductCard'
import { SOURCES } from '../data/catalog'

const QUICK_TERMS = ['iPhone 15', 'PlayStation 5', 'MacBook Air', 'AirPods Pro', 'Galaxy S24', 'Nintendo Switch']

export default function SearchPage({
  results, searching, hasSearched, loadingProgress,
  favorites, allPrices, onOpenProduct, onQuickSearch,
}) {
  if (searching) {
    return (
      <div className="animate-fade">
        <div style={{
          background: 'var(--card)', border: '1px solid var(--bord)',
          borderRadius: 11, padding: 18, marginBottom: 18,
        }}>
          <div style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 14 }}>
            Consultando {SOURCES.length} fontes de dados...
          </div>
          {SOURCES.map(source => {
            const done = !!loadingProgress[source.id]
            return (
              <div key={source.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 11, fontFamily: 'DM Mono' }}>
                <span style={{ width: 130, color: 'var(--text)' }}>{source.name}</span>
                <div style={{ flex: 1, height: 3, background: 'var(--muted-2)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', background: source.color, borderRadius: 2,
                    width: done ? '100%' : '0%', transition: 'width .6s cubic-bezier(.4,0,.2,1)',
                  }} />
                </div>
                <span style={{ width: 55, textAlign: 'right', fontSize: 9.5, color: done ? '#22c55e' : 'var(--muted)' }}>
                  {done ? '✓ OK' : '...'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (hasSearched && results.length === 0) {
    return (
      <div className="animate-fade" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>🔭</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 7 }}>Nenhum produto encontrado</div>
        <div style={{ fontSize: 12 }}>Tente: iPhone, Samsung, PlayStation, MacBook...</div>
      </div>
    )
  }

  if (hasSearched && results.length > 0) {
    return (
      <div className="animate-fade">
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 19, fontWeight: 700, marginBottom: 3 }}>Resultados</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'DM Mono', marginBottom: 18 }}>
          {results.length} produto(s) · {SOURCES.length} fontes consultadas
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
          {results.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              prices={allPrices[product.id]}
              isFavorite={favorites.includes(product.id)}
              onClick={() => onOpenProduct(product)}
              delay={idx * 50}
            />
          ))}
        </div>
      </div>
    )
  }

  // Initial state
  return (
    <div className="animate-fade" style={{ textAlign: 'center', padding: '70px 20px' }}>
      <div style={{ fontSize: 56, marginBottom: 18 }}>🛒</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
        Encontre o menor preço
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 22 }}>
        Comparamos {SOURCES.length} lojas simultaneamente em tempo real
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {QUICK_TERMS.map(term => (
          <button
            key={term}
            onClick={() => onQuickSearch(term)}
            style={{
              background: 'var(--card)', border: '1px solid var(--bord)',
              color: 'var(--muted)', padding: '5px 12px',
              borderRadius: 20, fontSize: 11.5,
              cursor: 'pointer', fontFamily: 'DM Sans',
              transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--amber)'; e.currentTarget.style.color = 'var(--amber)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bord)'; e.currentTarget.style.color = 'var(--muted)' }}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  )
}
