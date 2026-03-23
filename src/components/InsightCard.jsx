import { brl } from '../utils/priceEngine'

function ScoreRing({ score }) {
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#f43f5e'
  const r = 28
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference

  return (
    <svg width="68" height="68" viewBox="0 0 68 68" style={{ flexShrink: 0 }}>
      <circle cx="34" cy="34" r={r} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="5" />
      <circle
        cx="34" cy="34" r={r} fill="none"
        stroke={color} strokeWidth="5"
        strokeDasharray={circumference.toFixed(2)}
        strokeDashoffset={offset.toFixed(2)}
        strokeLinecap="round"
        transform="rotate(-90 34 34)"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="34" y="39" textAnchor="middle" fill={color} fontSize="14" fontWeight="700" fontFamily="DM Mono, monospace">
        {score}
      </text>
    </svg>
  )
}

export default function InsightCard({ insight }) {
  const { score, recommendation, current, min90, max90, avg90, pctFromAvg, trend7d } = insight

  const color  = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#f43f5e'
  const bgColor = score >= 75 ? 'rgba(34,197,94,.05)' : score >= 50 ? 'rgba(245,158,11,.05)' : 'rgba(244,63,94,.05)'
  const border  = score >= 75 ? 'rgba(34,197,94,.2)'  : score >= 50 ? 'rgba(245,158,11,.2)'  : 'rgba(244,63,94,.2)'

  const below = pctFromAvg < 0
  const falling = trend7d < 0

  return (
    <div style={{
      background: bgColor, border: `1px solid ${border}`,
      borderRadius: 11, padding: 18, marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <ScoreRing score={score} />

        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, color, marginBottom: 5 }}>
            {recommendation}
          </div>
          <div style={{ fontSize: 11.5, color: '#8888aa', lineHeight: 1.55 }}>
            Preço {Math.abs(pctFromAvg)}% {below ? 'abaixo' : 'acima'} da média de 90 dias
            {' · '}
            {falling
              ? `Caindo ${Math.abs(trend7d)}% na última semana`
              : `Subindo ${trend7d}% na última semana`
            }
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 20, fontWeight: 700, color: 'var(--amber)' }}>
            {brl(current)}
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9.5, color: 'var(--muted)', marginTop: 2 }}>
            mín {brl(min90)} · máx {brl(max90)}
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9.5, color: 'var(--muted)', marginTop: 1 }}>
            média {brl(avg90)}
          </div>
        </div>
      </div>
    </div>
  )
}
