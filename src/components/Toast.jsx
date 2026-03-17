import React from 'react'

export default function Toast({ toast }) {
  if (!toast) return null
  return (
    <div style={{
      position: 'fixed', bottom: 16, right: 16,
      background: 'var(--card-hover)', border: '1px solid var(--bord-hover)',
      borderRadius: 9, padding: '10px 14px',
      fontSize: 12.5, zIndex: 1000,
      boxShadow: '0 8px 24px rgba(0,0,0,.5)',
      display: 'flex', alignItems: 'center', gap: 8,
      animation: 'slideUp .3s ease',
    }}>
      <span style={{ fontSize: 14 }}>{toast.emoji}</span>
      <span>{toast.message}</span>
    </div>
  )
}
