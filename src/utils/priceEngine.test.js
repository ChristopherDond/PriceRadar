import { describe, expect, it } from 'vitest'
import { generateInsight, getBestAvailableSource, getPriceHistory, getSourcePrices } from './priceEngine'

describe('priceEngine', () => {
  it('returns deterministic source prices for same inputs', () => {
    const a = getSourcePrices(1, 5000)
    const b = getSourcePrices(1, 5000)
    expect(a).toEqual(b)
  })

  it('prioritizes available offers before unavailable ones', () => {
    const prices = getSourcePrices(2, 7000)
    const firstUnavailableIndex = prices.findIndex(p => !p.available)
    const lastAvailableIndex = prices.map((p, i) => (p.available ? i : -1)).filter(i => i >= 0).at(-1)

    if (firstUnavailableIndex !== -1 && lastAvailableIndex !== undefined) {
      expect(lastAvailableIndex).toBeLessThan(firstUnavailableIndex)
    }
  })

  it('returns the first available source as best offer', () => {
    const prices = getSourcePrices(3, 9000)
    const best = getBestAvailableSource(prices)
    expect(best).toBeTruthy()
    expect(best.available).toBe(true)
  })

  it('generates consistent insight fields', () => {
    const prices = getSourcePrices(4, 1800)
    const history = getPriceHistory(4, 1800, 90)
    const insight = generateInsight(history, prices)

    expect(insight.current).toBeGreaterThan(0)
    expect(insight.max90).toBeGreaterThanOrEqual(insight.min90)
    expect(insight.score).toBeGreaterThanOrEqual(0)
    expect(insight.score).toBeLessThanOrEqual(100)
  })
})
