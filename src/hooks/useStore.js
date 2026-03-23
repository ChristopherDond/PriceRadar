// ============================================================
// PRICERADAR — useStore
// Centralized state management with localStorage persistence.
// No external state library needed for a project this size.
// ============================================================

import { useState, useCallback } from 'react'

function loadLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}

function saveLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) }
  catch { return }
}

function normalizeAlerts(raw) {
  if (!Array.isArray(raw)) return []
  return raw
    .filter(a => a && typeof a === 'object')
    .map(a => ({
      id: a.id ?? Date.now(),
      productId: a.productId,
      name: a.name ?? 'Produto',
      emoji: a.emoji ?? '🛒',
      target: Number(a.target ?? 0),
      active: a.active !== false,
      createdAt: a.createdAt ?? new Date().toLocaleDateString('pt-BR'),
    }))
    .filter(a => Number.isFinite(a.productId) && Number.isFinite(a.target) && a.target > 0)
}

export function useStore() {
  const [favorites, setFavorites]   = useState(() => loadLS('pr_favs', []))
  const [alerts, setAlerts]         = useState(() => normalizeAlerts(loadLS('pr_alerts', [])))
  const [apiCalls, setApiCalls]     = useState(() => loadLS('pr_calls', 0))

  const toggleFavorite = useCallback((productId) => {
    setFavorites(prev => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
      saveLS('pr_favs', next)
      return next
    })
  }, [])

  const addAlert = useCallback((product, targetPrice) => {
    const alert = {
      id:        Date.now(),
      productId: product.id,
      name:      product.name,
      emoji:     product.emoji,
      target:    Number(targetPrice),
      active:    true,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    }
    setAlerts(prev => {
      const next = [...prev, alert]
      saveLS('pr_alerts', next)
      return next
    })
    return alert
  }, [])

  const deleteAlert = useCallback((id) => {
    setAlerts(prev => {
      const next = prev.filter(a => a.id !== id)
      saveLS('pr_alerts', next)
      return next
    })
  }, [])

  const incrementApiCalls = useCallback((count = 1) => {
    setApiCalls(prev => {
      const next = prev + count
      saveLS('pr_calls', next)
      return next
    })
  }, [])

  return {
    favorites, toggleFavorite,
    alerts, addAlert, deleteAlert,
    apiCalls, incrementApiCalls,
  }
}
