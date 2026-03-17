import React from 'react'
import { brl } from '../utils/priceEngine'

export default function AlertsPage({ alerts, onDeleteAlert }) {
  const active    = alerts.filter(a => a.current >  a.target)
  const triggered = alerts.filter(a => a.current <= a.target)

  if (!alerts.length) {
    return (
      <div className="animate-fade" style={{ textAlign: 'center', padding: '70px 20px', color: 'var(--muted)' }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>🔕</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 7 }}>Nenhum alerta criado</div>
        <div style={{ fontSize: 12 }}>Abra um produto e defina um preço alvo para ser avisado</div>
      </div>
    )
  }

  function AlertRow({ alert }) {
    const hit  = alert.current <= alert.target
    const diff = alert.current - alert.target
    const pct  = ((diff / alert.target) * 100).toFixed(1)

    return (
      <div style={{
        background: 'var(--card)',
        border: `1px solid ${hit ? 'rgba(34,197,94,.25)' : 'var(--bord)'}`,
        borderRadius: 9, padding: '12px 14px',
        display: 'flex', alignItems: 'center', gap: 11, marginBottom: 7,
      }}>
        <span style={{ fontSize: 22 }}>{alert.emoji}</span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {alert.name}
          </div>
          <div style={{ fontFamily: 'DM Mono', fontSize: 10.5, color: 'var(--muted)' }}>
            Alvo: {brl(alert.target)} · Atual: {brl(alert.current)}
          </div>
          <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 2 }}>
            Criado em {alert.createdAt}
          </div>
        </div>

        {/* Progress bar showing how close to target */}
        <div style={{ width: 80, flexShrink: 0 }}>
          <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'DM Mono', marginBottom: 3, textAlign: 'right' }}>
            {hit ? '−' : `+${pct}%`}
          </div>
          <div style={{ height: 3, background: 'var(--bord-hover)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2,
              background: hit ? '#22c55e' : 'var(--amber)',
              width: hit ? '100%' : `${Math.min(100, (alert.target / alert.current) * 100)}%`,
              transition: 'width .6s ease',
            }} />
          </div>
        </div>

        {hit ? (
          <span style={{ background: 'var(--green-dim)', color: '#22c55e', border: '1px solid rgba(34,197,94,.2)', fontSize: 9, padding: '3px 8px', borderRadius: 4, fontWeight: 600, whiteSpace: 'nowrap' }}>
            🎉 ATINGIDO
          </span>
        ) : (
          <span style={{ background: 'var(--amber-dim)', color: 'var(--amber)', border: '1px solid rgba(245,158,11,.2)', fontSize: 9, padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>
            Aguardando
          </span>
        )}

        <button
          onClick={() => onDeleteAlert(alert.id)}
          style={{ background: 'transparent', border: '1px solid var(--bord)', color: 'var(--muted)', padding: '5px 9px', borderRadius: 6, cursor: 'pointer', fontSize: 12, flexShrink: 0 }}
          title="Deletar alerta"
        >
          🗑️
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fade">
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 19, fontWeight: 700, marginBottom: 3 }}>Alertas de Preço</div>
      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'DM Mono', marginBottom: 20 }}>
        {triggered.length} atingido(s) · {active.length} aguardando
      </div>

      {triggered.length > 0 && (
        <>
          <div style={{ fontSize: 10, color: '#22c55e', fontFamily: 'DM Mono', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
            🎉 Atingidos
          </div>
          {triggered.map(a => <AlertRow key={a.id} alert={a} />)}
          <div style={{ height: 14 }} />
        </>
      )}

      {active.length > 0 && (
        <>
          <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'DM Mono', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
            Aguardando
          </div>
          {active.map(a => <AlertRow key={a.id} alert={a} />)}
        </>
      )}
    </div>
  )
}
