import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { brl } from '../utils/priceEngine'

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--bord)',
      borderRadius: 7, padding: '8px 12px',
      fontFamily: 'DM Mono, monospace', fontSize: 11.5,
    }}>
      <div style={{ color: 'var(--muted)', fontSize: 9.5, marginBottom: 3 }}>{label}</div>
      <div style={{ color: 'var(--amber)', fontWeight: 600 }}>{brl(payload[0].value)}</div>
    </div>
  )
}

export default function PriceChart({ data, avg }) {
  return (
    <ResponsiveContainer width="100%" height={190}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}   />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />

        <XAxis
          dataKey="date"
          tick={{ fill: '#5a5a7a', fontSize: 9, fontFamily: 'DM Mono, monospace' }}
          tickLine={false}
          interval={Math.floor(data.length / 5)}
        />
        <YAxis
          tick={{ fill: '#5a5a7a', fontSize: 9, fontFamily: 'DM Mono, monospace' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => `R$${(v / 1000).toFixed(1)}k`}
          width={52}
        />

        <Tooltip content={<ChartTooltip />} />

        <ReferenceLine
          y={avg}
          stroke="rgba(245,158,11,0.35)"
          strokeDasharray="4 4"
          label={{ value: 'Média 90d', fill: '#5a5a7a', fontSize: 9, fontFamily: 'DM Mono' }}
        />

        <Area
          type="monotone"
          dataKey="price"
          stroke="#f59e0b"
          strokeWidth={2}
          fill="url(#priceGradient)"
          dot={false}
          activeDot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
