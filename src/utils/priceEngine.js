// ============================================================
// PRICERADAR — Price Utilities
// Seeded-random generators + smart insight engine
// In production: replace generators with real API fetchers
// ============================================================

import { SOURCES } from '../data/catalog'

/** Seeded pseudo-random (deterministic per product/source combo) */
export function seededRng(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

/** Format BRL currency */
export function brl(value) {
  return `R$ ${value.toLocaleString('pt-BR')}`
}

/**
 * Simulate fetching prices from multiple sources for a product.
 * Returns sorted array (cheapest first) with response metadata.
 *
 * @param {number} productId
 * @param {number} basePrice
 * @returns {Array<SourcePrice>}
 */
export function getSourcePrices(productId, basePrice) {
  return SOURCES
    .map((source, i) => {
      const seed = productId * 100 + i
      return {
        ...source,
        price:        Math.round(basePrice * (0.9 + seededRng(seed) * 0.22)),
        available:    seededRng(seed + 50) > 0.08,
        installments: Math.floor(seededRng(seed + 111) * 8) + 3,
        responseMs:   Math.floor(seededRng(seed + 200) * 350) + 80,
      }
    })
    .sort((a, b) => a.price - b.price)
}

/**
 * Generate a 90-day price history with realistic volatility.
 * Includes a simulated Black Friday dip.
 *
 * @param {number} productId
 * @param {number} basePrice
 * @param {number} days
 * @returns {Array<{date: string, price: number}>}
 */
export function getPriceHistory(productId, basePrice, days = 90) {
  const history = []
  const now = new Date()
  let price = basePrice * 1.12 // Start above base

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    const seed = productId * 9999 + i
    const noise = (seededRng(seed) - 0.5) * 0.04 // ±2% daily noise
    const trend = -0.0008                          // Slight downward trend

    price *= (1 + trend + noise)

    // Simulate Black Friday drop (days 58–62 back from today)
    if (i >= 58 && i <= 62) price = basePrice * 0.82

    // Keep within reasonable bounds
    price = Math.max(basePrice * 0.72, Math.min(basePrice * 1.28, price))

    history.push({
      date:  date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
      price: Math.round(price),
    })
  }

  return history
}

/**
 * Analyze price history and generate a buy recommendation.
 *
 * @param {Array} history   - Full 90-day price history
 * @param {Array} srcPrices - Source prices (sorted cheapest first)
 * @returns {Insight}
 */
export function generateInsight(history, srcPrices) {
  const current = srcPrices[0].price
  const prices  = history.map(h => h.price)
  const max90   = Math.max(...prices)
  const min90   = Math.min(...prices)
  const avg90   = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)

  const pctFromAvg = ((current - avg90) / avg90 * 100).toFixed(1)
  const last7      = history.slice(-7).map(h => h.price)
  const trend7d    = ((last7.at(-1) - last7[0]) / last7[0] * 100).toFixed(1)

  let recommendation, score

  if (current <= min90 * 1.05) {
    recommendation = 'COMPRE AGORA'
    score = 95
  } else if (current <= avg90 * 0.95) {
    recommendation = 'BOA OPORTUNIDADE'
    score = 78
  } else if (current >= max90 * 0.95) {
    recommendation = 'AGUARDE — PREÇO ALTO'
    score = 22
  } else {
    recommendation = 'PREÇO MÉDIO'
    score = 55
  }

  return { current, max90, min90, avg90, pctFromAvg, trend7d, recommendation, score }
}
