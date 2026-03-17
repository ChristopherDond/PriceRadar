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
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function useStore() {
  const [favorites, setFavorites]   = useState(() => loadLS('pr_favs', []))
  const [alerts, setAlerts]         = useState(() => loadLS('pr_alerts', []))
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

  const addAlert = useCallback((product, targetPrice, currentPrice) => {
    const alert = {
      id:        Date.now(),
      productId: product.id,
      name:      product.name,
      emoji:     product.emoji,
      target:    parseInt(targetPrice),
      current:   currentPrice,
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
