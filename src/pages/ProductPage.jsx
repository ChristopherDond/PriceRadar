import React, { useState, useMemo } from 'react'
import PriceChart from '../components/PriceChart'
import InsightCard from '../components/InsightCard'
import { getSourcePrices, getPriceHistory, generateInsight, brl } from '../utils/priceEngine'

export default function ProductPage({ product, favorites, onToggleFavorite, onAddAlert, onBack }) {
  const [period, setPeriod] = useState('90d')
  const [alertValue, setAlertValue] = useState('')

  const prices  = useMemo(() => getSourcePrices(product.id, product.base), [product])
  const hist90  = useMemo(() => getPriceHistory(product.id, product.base, 90), [product])
  const hist30  = useMemo(() => getPriceHistory(product.id, product.base, 30), [product])
  const history = period === '30d' ? hist30 : hist90
  const insight = useMemo(() => generateInsight(hist90, prices), [hist90, prices])
  const isFav   = favorites.includes(product.id)

  function handleAddAlert() {
    const val = parseInt(alertValue)
    if (!val || val <= 0) return
    onAddAlert(product, val, prices[0].price)
    setAlertValue('')
  }

  const savings = prices[prices.length - 1].price - prices[0].price

  return (
    <div className="animate-fade">
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11.5, color: 'var(--muted)', cursor: 'pointer',
          border: 'none', background: 'none', fontFamily: 'DM Sans',
          marginBottom: 18, padding: 0, transition: 'color .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
      >
        ← Voltar aos resultados
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 36, marginBottom: 6 }}>{product.emoji}</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 3 }}>{product.name}</div>
          <div style={{ fontFamily: 'DM Mono', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
            {product.brand} · {product.cat}
          </div>
        </div>
        <button
          onClick={() => onToggleFavorite(product.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 13px', borderRadius: 7, fontSize: 11.5, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'DM Sans', transition: 'all .15s',
            background: isFav ? 'var(--red-dim)' : 'transparent',
            border: isFav ? '1px solid rgba(244,63,94,.3)' : '1px solid var(--bord)',
            color: isFav ? 'var(--red)' : 'var(--muted)',
          }}
        >
          {isFav ? '❤️ Favoritado' : '🤍 Favoritar'}
        </button>
      </div>

      {/* Insight */}
      <InsightCard insight={insight} />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 14 }}>
        {[
          { label: 'Melhor Preço',    value: brl(prices[0].price),    color: '#22c55e', sub: `via ${prices[0].name}` },
          { label: 'Maior Preço',     value: brl(prices.at(-1).price), color: 'var(--red)', sub: `via ${prices.at(-1).name}` },
          { label: 'Economia Máxima', value: brl(savings),            color: 'var(--amber)', sub: 'entre lojas' },
          { label: 'Lojas Ativas',    value: `${prices.filter(p => p.available).length}/${prices.length}`, color: 'var(--text)', sub: 'disponíveis' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--bord)', borderRadius: 9, padding: 14 }}>
            <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'DM Mono', marginBottom: 5 }}>{s.label}</div>
            <div style={{ fontSize: 17, fontWeight: 700, fontFamily: 'DM Mono', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart + Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 14, marginBottom: 14 }}>
        {/* Chart */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--bord)', borderRadius: 11, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700 }}>Histórico de Preços</div>
            <div style={{ display: 'flex', gap: 3, background: 'var(--surf)', padding: 3, borderRadius: 7 }}>
              {['30d', '90d'].map(p => (
                <button key={p} onClick={() => setPeriod(p)} style={{
                  padding: '5px 12px', borderRadius: 5, fontSize: 11, fontWeight: 500,
                  cursor: 'pointer', border: 'none', fontFamily: 'DM Sans',
                  background: period === p ? 'var(--card)' : 'transparent',
                  color: period === p ? 'var(--text)' : 'var(--muted)',
                  transition: 'all .15s',
                }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <PriceChart data={history} avg={insight.avg90} />
        </div>

        {/* Source table */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--bord)', borderRadius: 11, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--bord)' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700 }}>Comparar Lojas</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr>
                {['Loja', 'Preço', 'Parcelas'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--muted)', fontFamily: 'DM Mono', fontWeight: 400, borderBottom: '1px solid var(--bord)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {prices.map((src, i) => (
                <tr key={src.id} style={{ opacity: src.available ? 1 : 0.45 }}>
                  <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--bord)', fontFamily: 'DM Mono' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: src.color, flexShrink: 0 }} />
                      {src.name}
                    </div>
                  </td>
                  <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--bord)', fontFamily: 'DM Mono' }}>
                    <span style={{ color: i === 0 ? '#22c55e' : 'var(--text)', fontWeight: i === 0 ? 600 : 400 }}>
                      {brl(src.price)}
                    </span>
                    {i === 0 && (
                      <span style={{ marginLeft: 5, background: 'var(--green-dim)', color: '#22c55e', border: '1px solid rgba(34,197,94,.2)', fontSize: 8.5, padding: '2px 6px', borderRadius: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5 }}>
                        Melhor
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--bord)', fontFamily: 'DM Mono', fontSize: 10.5, color: 'var(--muted)' }}>
                    {src.available ? `${src.installments}x s/j` : 'Indisponível'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert creation */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--bord)', borderRadius: 11, padding: 18 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 3 }}>🔔 Criar Alerta de Preço</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 14, fontFamily: 'DM Mono' }}>
          Notifique quando o preço cair abaixo do valor definido
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', maxWidth: 220 }}>
            <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: 'var(--muted)', fontFamily: 'DM Mono' }}>R$</span>
            <input
              value={alertValue}
              onChange={e => setAlertValue(e.target.value.replace(/\D/g, ''))}
              placeholder={Math.round(insight.current * 0.9).toString()}
              style={{
                background: 'var(--surf)', border: '1px solid var(--bord)',
                borderRadius: 7, padding: '8px 11px 8px 30px',
                fontSize: 13, color: 'var(--text)', fontFamily: 'DM Mono', outline: 'none',
                width: '100%', transition: 'border-color .15s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--amber)'}
              onBlur={e => e.target.style.borderColor = 'var(--bord)'}
              onKeyDown={e => e.key === 'Enter' && handleAddAlert()}
            />
          </div>
          <button
            onClick={handleAddAlert}
            disabled={!alertValue}
            style={{
              background: 'var(--amber)', color: 'var(--bg)', border: 'none',
              padding: '8px 14px', borderRadius: 7, fontSize: 12.5, fontWeight: 600,
              cursor: alertValue ? 'pointer' : 'not-allowed',
              opacity: alertValue ? 1 : 0.4, fontFamily: 'DM Sans',
            }}
          >
            Criar Alerta
          </button>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            Sugestão: {brl(Math.round(insight.current * 0.9))} (−10%)
          </span>
        </div>
      </div>
    </div>
  )
}
