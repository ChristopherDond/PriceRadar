import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { SOURCES } from '../data/catalog'
import { seededRng } from '../utils/priceEngine'

// Generate stable mock API metrics
const API_METRICS = SOURCES.map((s, i) => ({
  ...s,
  calls:      Math.floor(seededRng(i * 777) * 200) + 50,
  latencyMs:  Math.floor(seededRng(i * 333) * 300) + 100,
  errorPct:   (seededRng(i * 999) * 2.5).toFixed(1),
  uptime:     (98 + seededRng(i * 555) * 1.9).toFixed(2),
}))

function MetricTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--bord)', borderRadius: 7, padding: '8px 12px', fontFamily: 'DM Mono', fontSize: 11.5 }}>
      <div style={{ color: 'var(--muted)', fontSize: 9.5, marginBottom: 3 }}>{label}</div>
      <div style={{ color: payload[0].fill, fontWeight: 600 }}>{payload[0].value}ms</div>
    </div>
  )
}

export default function ApiStatsPage({ apiCalls, sourceCount }) {
  const avgLatency   = Math.round(API_METRICS.reduce((s, m) => s + m.latencyMs, 0) / API_METRICS.length)
  const successRate  = (100 - API_METRICS.reduce((s, m) => s + parseFloat(m.errorPct), 0) / API_METRICS.length).toFixed(1)

  return (
    <div className="animate-fade">
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 19, fontWeight: 700, marginBottom: 3 }}>Dashboard de API</div>
      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'DM Mono', marginBottom: 18 }}>
        Consumo e performance das fontes de dados
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'var(--kpi-cols)', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Total de Calls', value: apiCalls.toLocaleString('pt-BR'), color: 'var(--amber)', sub: 'sessão atual' },
          { label: 'Fontes Ativas',  value: `${sourceCount} / ${sourceCount}`, color: 'var(--text)', sub: '100% uptime' },
          { label: 'Latência Média', value: `${avgLatency}ms`,                color: 'var(--text)', sub: 'por request' },
          { label: 'Taxa de Sucesso',value: `${successRate}%`,                color: '#22c55e',      sub: 'últimas 24h' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--bord)', borderRadius: 9, padding: 14 }}>
            <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'DM Mono', marginBottom: 5 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'DM Mono', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Latency bar chart */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--bord)', borderRadius: 11, padding: 18, marginBottom: 14 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Latência por Fonte (ms)</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={API_METRICS} margin={{ top: 0, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#5a5a7a', fontSize: 9, fontFamily: 'DM Mono' }}
              tickLine={false} axisLine={false}
              tickFormatter={v => v.split(' ')[0]}
            />
            <YAxis
              tick={{ fill: '#5a5a7a', fontSize: 9, fontFamily: 'DM Mono' }}
              tickLine={false} axisLine={false}
              tickFormatter={v => `${v}ms`} width={42}
            />
            <Tooltip content={<MetricTooltip />} cursor={{ fill: 'rgba(255,255,255,.03)' }} />
            <Bar dataKey="latencyMs" radius={[4, 4, 0, 0]}>
              {API_METRICS.map(m => (
                <Cell key={m.id} fill={m.color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Source table */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--bord)', borderRadius: 11, overflowX: 'auto' }}>
        <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--bord)' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700 }}>Status por Fonte</div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr>
              {['Fonte', 'Status', 'Calls', 'Latência', 'Erros', 'Uptime'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--muted)', fontFamily: 'DM Mono', fontWeight: 400, borderBottom: '1px solid var(--bord)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {API_METRICS.map(m => (
              <tr key={m.id}>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--bord)', fontFamily: 'DM Mono' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: m.color }} />
                    {m.name}
                  </div>
                </td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--bord)' }}>
                  <span style={{ background: 'var(--green-dim)', color: '#22c55e', fontSize: 8.5, padding: '2px 7px', borderRadius: 4, fontWeight: 600 }}>
                    Online
                  </span>
                </td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--bord)', fontFamily: 'DM Mono', fontSize: 11 }}>{m.calls}</td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--bord)', fontFamily: 'DM Mono', fontSize: 11 }}>{m.latencyMs}ms</td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--bord)', fontFamily: 'DM Mono', fontSize: 11, color: 'var(--red)' }}>{m.errorPct}%</td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--bord)', fontFamily: 'DM Mono', fontSize: 11 }}>{m.uptime}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
