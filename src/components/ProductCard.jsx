import React from 'react'
import { brl } from '../utils/priceEngine'

export default function ProductCard({ product, prices, isFavorite, onClick, delay = 0 }) {
  const best = prices[0]

  return (
    <div
      className="animate-stagger"
      onClick={onClick}
      style={{
        background: 'var(--card)', border: '1px solid var(--bord)',
        borderRadius: 11, padding: 14, cursor: 'pointer',
        transition: 'all .15s', animationDelay: `${delay}ms`,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--bord-hover)'; e.currentTarget.style.background = 'var(--card-hover)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bord)'; e.currentTarget.style.background = 'var(--card)'; e.currentTarget.style.transform = 'none' }}
    >
      <div style={{ fontSize: 28, marginBottom: 6 }}>{product.emoji}</div>

      <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 2, lineHeight: 1.3 }}>
        {product.name}
      </div>
      <div style={{ fontSize: 9.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', fontFamily: 'DM Mono, monospace', marginBottom: 10 }}>
        {product.brand} · {product.cat}
      </div>

      <div style={{ fontSize: 8.5, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>a partir de</div>
      <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--amber)', fontFamily: 'DM Mono, monospace' }}>
        {brl(best.price)}
      </div>
      <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
        via {best.name}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {prices.filter(p => p.available).map(p => (
            <div key={p.id} style={{ width: 6, height: 6, borderRadius: '50%', background: p.color }} title={p.name} />
          ))}
        </div>
        {isFavorite && <span style={{ fontSize: 12 }}>❤️</span>}
      </div>
    </div>
  )
}
