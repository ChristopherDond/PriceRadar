import { brl, getBestAvailableSource } from '../utils/priceEngine'

export default function ProductCard({ product, prices, isFavorite, onClick, delay = 0 }) {
  const best = getBestAvailableSource(prices)
  if (!best) return null

  return (
    <div
      className="animate-stagger product-card"
      style={{
        background: 'var(--card)', border: '1px solid var(--bord)',
        borderRadius: 11, padding: 14, cursor: 'pointer',
        transition: 'all .15s', animationDelay: `${delay}ms`,
        width: '100%', textAlign: 'left',
      }}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={`Abrir detalhes de ${product.name}`}
        style={{
          width: '100%', background: 'transparent', border: 'none', padding: 0,
          textAlign: 'left', cursor: 'pointer', color: 'inherit',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.name}
              style={{ width: 42, height: 42, borderRadius: 10, objectFit: 'cover', background: 'var(--surf)', flexShrink: 0 }}
            />
          ) : (
            <div style={{ fontSize: 28, lineHeight: 1, width: 42, height: 42, display: 'grid', placeItems: 'center', background: 'var(--surf)', borderRadius: 10, flexShrink: 0 }}>
              {product.emoji}
            </div>
          )}

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 2, lineHeight: 1.3 }}>
              {product.name}
            </div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', fontFamily: 'DM Mono, monospace' }}>
              {product.brand} · {product.cat}
            </div>
          </div>
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
      </button>

      {product.link && (
        <a
          href={product.link}
          target="_blank"
          rel="noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            display: 'inline-flex', marginTop: 10, fontSize: 10.5,
            color: 'var(--amber)', textDecoration: 'none', fontFamily: 'DM Mono, monospace',
          }}
        >
          Abrir anúncio original ↗
        </a>
      )}
    </div>
  )
}
