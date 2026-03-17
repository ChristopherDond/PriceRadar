import React from 'react'

const NAV_ITEMS = [
  { id: 'search',    icon: '🔍', label: 'Buscar'    },
  { id: 'favorites', icon: '❤️', label: 'Favoritos' },
  { id: 'alerts',    icon: '🔔', label: 'Alertas'   },
  { id: 'api-stats', icon: '📊', label: 'API Stats' },
]

export default function Sidebar({ view, favCount, alertCount, apiCalls, onNavigate }) {
  const activeView = view === 'product' ? 'search' : view

  return (
    <aside style={{
      width: 200, minHeight: '100vh',
      background: 'var(--surf)', borderRight: '1px solid var(--bord)',
      display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0, height: '100vh',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid var(--bord)' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 800, color: 'var(--amber)', letterSpacing: '-0.5px' }}>
          PriceRadar
        </div>
        <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'DM Mono, monospace', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 2 }}>
          comparador inteligente
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '10px 6px', flex: 1 }}>
        {NAV_ITEMS.map(item => {
          const badge = item.id === 'favorites' ? favCount : item.id === 'alerts' ? alertCount : 0
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '9px 10px', borderRadius: 7,
                cursor: 'pointer', fontSize: 12.5, fontWeight: 500,
                color: isActive ? 'var(--amber)' : 'var(--muted)',
                background: isActive ? 'var(--amber-dim)' : 'transparent',
                border: 'none', width: '100%', textAlign: 'left',
                fontFamily: 'DM Sans, sans-serif',
                marginBottom: 1, transition: 'all .15s',
              }}
            >
              <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
              {badge > 0 && (
                <span style={{
                  marginLeft: 'auto', background: 'var(--amber)', color: 'var(--bg)',
                  fontSize: 9, fontWeight: 700, padding: '1px 5px',
                  borderRadius: 8, fontFamily: 'DM Mono, monospace',
                }}>
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Stats */}
      <div style={{ padding: 10, borderTop: '1px solid var(--bord)', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {[
          { label: 'API Calls', value: apiCalls.toLocaleString('pt-BR'), color: 'var(--amber)' },
          { label: 'Fontes Ativas', value: '5', color: 'var(--text)' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--card)', border: '1px solid var(--bord)', borderRadius: 6, padding: '8px 10px' }}>
            <div style={{ fontSize: 8.5, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: stat.color, fontFamily: 'DM Mono, monospace', marginTop: 2 }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
