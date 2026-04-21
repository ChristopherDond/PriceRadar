# PriceRadar

[Versao em portugues](README.md)

Smart price comparison app focused on finding better buying opportunities.
The app simulates queries across multiple stores, shows price history, generates recommendations, and lets users save favorites and alerts.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-2-6E9F18?logo=vitest&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-f59e0b)

## Overview

This project was built to demonstrate a complete frontend product experience:

- search by name, brand, or category
- multi-source simulation with per-API progress
- store comparison with the best available offer
- up to 90 days of price history with plausible market behavior
- buying insights based on average, minimum, maximum, and trend
- favorites and alerts persisted in localStorage
- API usage statistics dashboard

## Stack

- React 18
- Vite 5
- Recharts
- Vitest + Testing Library
- ESLint 9

## Requirements

- Node.js 18+
- npm 9+

## Quick Start

```bash
git clone https://github.com/ChristopherDond/PriceRadar.git
cd PriceRadar
npm install
npm run dev
```

App available at http://localhost:5173.

## Scripts

```bash
npm run dev         # development server
npm run build       # production build
npm run preview     # preview production build
npm run lint        # static analysis
npm run test        # run tests once
npm run test:watch  # run tests in watch mode
```

## Architecture

```text
src/
  components/  # reusable UI
  data/        # product and source catalog
  hooks/       # shared state and behavior
  pages/       # main application views
  styles/      # global styles
  utils/       # price engine and insights
```

Key implementation points:

- search uses batched request simulation with per-source progress
- prices are deterministic by seed to keep consistency between renders
- favorites, alerts, and API call counts are persisted in the browser
- pages are lazy-loaded to reduce initial load cost

## How Buying Insight Works

The engine computes historical metrics and classifies the opportunity based on the current price:

- BUY NOW: current price is very close to the historical minimum
- GOOD OPPORTUNITY: current price is below average
- AVERAGE PRICE: middle range
- WAIT - HIGH PRICE: current price is close to the historical maximum

This rule set is centralized in the engine to make threshold tuning easier.

## Integrating Real APIs

The project currently uses simulated data to allow immediate local execution without API keys.

To connect real providers:

1. Create source-specific search adapters.
2. Normalize responses into a single format.
3. Replace simulated generation with real calls.
4. Keep a simulated fallback for failure cases.

Suggested item format:

```ts
type PriceResult = {
  id: string
  name: string
  price: number
  sourceId: string
  available: boolean
  link?: string
  responseMs?: number
}
```

## Quality

- unit tests for the pricing engine
- base ready to expand component and page coverage
- linting for consistent code standards

## Suggested Roadmap

- advanced filters (price range, category, brand)
- saved history per searched product
- side-by-side offer comparison
- real alert notifications via email/web push
- backend to sync favorites and alerts across devices

## License

MIT

## Note

This repository uses simulated data for demonstration purposes. Displayed values do not represent real-time market prices.
