import React from 'react'
import { PRODUCTS } from '../data/catalog'
import { getSourcePrices, brl } from '../utils/priceEngine'

export default function FavoritesPage({ favorites, onOpenProduct, onRemoveFavorite }) {
  const items = PRODUCTS.filter(p => favorites.includes(p.id))

  if (!items.length) {
    return (
      <div className="animate-fade" style={{ textAlign: 'center', padding: '70px 20px', color: 'var(--muted)' }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>🤍</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 7 }}>Nenhum favorito ainda</div>
        <div style={{ fontSize: 12 }}>Busque produtos e clique em "Favoritar" para salvar aqui</div>
      </div>
    )
  }

  return (
    <div className="animate-fade">
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 19, fontWeight: 700, marginBottom: 3 }}>Favoritos</div>
      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'DM Mono', marginBottom: 18 }}>
        {items.length} produto(s) salvado(s)
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
        {items.map((p, idx) => {
          const prices = getSourcePrices(p.id, p.base)
          const best   = prices[0]
          return (
            <div
              key={p.id}
              className="animate-stagger"
              style={{
                background: 'var(--card)', border: '1px solid var(--bord)',
                borderRadius: 11, padding: 14,
                animationDelay: `${idx * 50}ms`,
              }}
            >
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => onOpenProduct(p)}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>{p.emoji}</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 2, lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ fontSize: 9.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', fontFamily: 'DM Mono', marginBottom: 10 }}>
                  {p.brand} · {p.cat}
                </div>
                <div style={{ fontSize: 8.5, color: 'var(--muted)', fontFamily: 'DM Mono' }}>melhor preço</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--amber)', fontFamily: 'DM Mono' }}>
                  {brl(best.price)}
                </div>
                <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'DM Mono' }}>via {best.name}</div>
              </div>

              <button
                onClick={() => onRemoveFavorite(p.id)}
                style={{
                  width: '100%', marginTop: 12,
                  background: 'var(--red-dim)', border: '1px solid rgba(244,63,94,.2)',
                  color: 'var(--red)', padding: '6px', borderRadius: 6,
                  fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans',
                  transition: 'opacity .15s',
                }}
              >
                Remover dos favoritos ❤️
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
