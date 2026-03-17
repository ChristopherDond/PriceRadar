// ============================================================
// PRICERADAR — Mock Data
// Simulates responses from multiple price comparison APIs
// In production, replace with real API integrations (e.g. Buscape API,
// Mercado Livre API, etc.)
// ============================================================

/** API sources with metadata */
export const SOURCES = [
  { id: 'amazon',    name: 'Amazon',         color: '#f59e0b' },
  { id: 'ml',        name: 'Mercado Livre',   color: '#22c55e' },
  { id: 'magalu',    name: 'Magazine Luiza',  color: '#3b82f6' },
  { id: 'ame',       name: 'Americanas',      color: '#f43f5e' },
  { id: 'kabum',     name: 'KaBuM',           color: '#a855f7' },
]

/** Product catalog (mock; real app fetches from search APIs) */
export const PRODUCTS = [
  { id: 1,  name: 'iPhone 15 Pro Max 256GB',  cat: 'Smartphones', emoji: '📱', base: 8499, brand: 'Apple'     },
  { id: 2,  name: 'Samsung Galaxy S24 Ultra', cat: 'Smartphones', emoji: '📱', base: 7299, brand: 'Samsung'   },
  { id: 3,  name: 'MacBook Air M2 8GB',        cat: 'Notebooks',   emoji: '💻', base: 9499, brand: 'Apple'     },
  { id: 4,  name: 'AirPods Pro 2ª Geração',   cat: 'Áudio',       emoji: '🎧', base: 1899, brand: 'Apple'     },
  { id: 5,  name: 'PlayStation 5 Digital',    cat: 'Games',       emoji: '🎮', base: 3799, brand: 'Sony'      },
  { id: 6,  name: 'Nintendo Switch OLED',     cat: 'Games',       emoji: '🕹️', base: 2099, brand: 'Nintendo'  },
  { id: 7,  name: 'LG OLED TV 55" C3',        cat: 'TVs',         emoji: '📺', base: 6799, brand: 'LG'        },
  { id: 8,  name: 'Sony WH-1000XM5',          cat: 'Áudio',       emoji: '🎧', base: 1799, brand: 'Sony'      },
  { id: 9,  name: 'iPad Pro 12.9" M2',         cat: 'Tablets',     emoji: '📱', base: 12499, brand: 'Apple'   },
  { id: 10, name: 'Dyson V15 Detect',         cat: 'Casa',        emoji: '🌀', base: 4299, brand: 'Dyson'     },
]
