# 🛒 PriceRadar

> Comparador inteligente de preços — busca produtos em múltiplas lojas com histórico, alertas e insights de compra.

![PriceRadar Preview](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2-22C55E?logo=chart.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-f59e0b)

---

## ✨ Funcionalidades

| Feature | Descrição |
|---|---|
| 🔍 **Busca Multi-fonte** | Simula consultas paralelas em 5 lojas (Amazon, Mercado Livre, Magalu, Americanas, KaBuM) com barra de progresso por API |
| 📊 **Histórico de Preços** | Gráfico interativo com 30 ou 90 dias de histórico, linha de média e destaque de dip (Black Friday simulado) |
| 🧠 **Score de Compra** | Algoritmo que analisa preço atual vs. média histórica e gera uma recomendação: *Compre Agora*, *Boa Oportunidade*, *Aguarde* |
| 🔔 **Alertas de Preço** | Defina um valor alvo e acompanhe visualmente quando o preço atingir o objetivo |
| ❤️ **Favoritos** | Salve produtos para acompanhar rapidamente sem precisar buscar novamente |
| 📈 **Dashboard de API** | Métricas de latência, taxa de sucesso e uptime por fonte, com gráfico de barras |
| 💾 **Persistência Local** | Favoritos, alertas e contagem de API calls persistidos no `localStorage` |

---

## 🚀 Como Rodar

### Pré-requisitos
- [Node.js](https://nodejs.org/) v18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/priceradar.git
cd priceradar

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` no browser.

### Build para produção

```bash
npm run build
npm run preview
```

---

## 🗂️ Estrutura do Projeto

```
priceradar/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx              # Entry point
    ├── App.jsx               # Orquestrador principal + roteamento de views
    │
    ├── styles/
    │   └── global.css        # Variáveis CSS, reset, animações
    │
    ├── data/
    │   └── catalog.js        # Catálogo de produtos e fontes de API
    │
    ├── utils/
    │   └── priceEngine.js    # Gerador de preços, histórico e insights
    │
    ├── hooks/
    │   ├── useStore.js       # Estado global (favoritos, alertas, API calls)
    │   └── useToast.js       # Notificações temporárias
    │
    ├── components/
    │   ├── Sidebar.jsx       # Navegação lateral com stats
    │   ├── ProductCard.jsx   # Card de produto nos resultados de busca
    │   ├── PriceChart.jsx    # Gráfico de histórico de preços (Recharts)
    │   ├── InsightCard.jsx   # Recomendação com score visual (SVG ring)
    │   └── Toast.jsx         # Notificação toast
    │
    └── pages/
        ├── SearchPage.jsx    # Página de busca com loading de APIs
        ├── ProductPage.jsx   # Detalhe do produto + gráfico + alerta
        ├── FavoritesPage.jsx # Lista de produtos favoritados
        ├── AlertsPage.jsx    # Gerenciamento de alertas de preço
        └── ApiStatsPage.jsx  # Dashboard de consumo de API
```

---

## 🧩 Como Conectar APIs Reais

O projeto usa dados gerados deterministicamente para demonstração. Para conectar APIs reais, edite `src/utils/priceEngine.js`:

```js
// Exemplo: Mercado Livre API
export async function getMLPrices(query) {
  const res = await fetch(
    `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}&limit=5`
  )
  const data = await res.json()
  return data.results.map(item => ({
    id:    item.id,
    name:  item.title,
    price: item.price,
    link:  item.permalink,
  }))
}
```

APIs gratuitas compatíveis:
- **Mercado Livre**: `api.mercadolibre.com` — documentação em [developers.mercadolivre.com.br](https://developers.mercadolivre.com.br)
- **Open Food Facts**: `world.openfoodfacts.org/api`
- **Fake Store API**: `fakestoreapi.com` (ótima para testes)

---

## 🛠️ Stack

- **React 18** — UI declarativa com hooks
- **Vite 5** — bundler ultrarrápido
- **Recharts** — gráficos responsivos (AreaChart, BarChart)
- **localStorage** — persistência sem backend

---

## 🎯 Diferenciais para Portfólio

Este projeto demonstra:

- **Consumo de múltiplas APIs** com tratamento de estado de loading
- **Algoritmo de análise de preços** — média, máx, mín, tendência e score
- **Persistência de dados** sem banco de dados
- **Componentização** — separação clara entre componentes, páginas, hooks e utils
- **UX de dados** — gráficos, badges de status, score visual com SVG

---

## 📄 Licença

MIT © 2025 — Feito com ☕ para portfólio

---

> **Nota**: Este projeto utiliza dados gerados para demonstração. Os preços exibidos não refletem valores reais de mercado.
