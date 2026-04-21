# PriceRadar

Comparador inteligente de precos com foco em descoberta de oportunidades de compra.
O app simula consultas em multiplas lojas, mostra historico de preco, gera recomendacoes e permite salvar favoritos e alertas.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-2-6E9F18?logo=vitest&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-f59e0b)

## Visao Geral

O projeto foi construido para demonstrar uma experiencia completa de produto frontend:

- busca por nome, marca ou categoria
- simulacao de fontes com progresso por API
- comparacao de lojas com melhor oferta disponivel
- historico de ate 90 dias com comportamento plausivel de mercado
- insight de compra baseado em media, minimo, maximo e tendencia
- favoritos e alertas persistidos no localStorage
- painel de estatisticas de uso das APIs

## Stack

- React 18
- Vite 5
- Recharts
- Vitest + Testing Library
- ESLint 9

## Requisitos

- Node.js 18+
- npm 9+

## Setup Rapido

```bash
git clone https://github.com/ChristopherDond/PriceRadar.git
cd PriceRadar
npm install
npm run dev
```

Aplicacao disponivel em http://localhost:5173.

## Scripts

```bash
npm run dev         # ambiente de desenvolvimento
npm run build       # build de producao
npm run preview     # preview do build
npm run lint        # analise estatica
npm run test        # executa testes uma vez
npm run test:watch  # testes em modo watch
```

## Arquitetura

```text
src/
  components/  # UI reutilizavel
  data/        # catalogo de produtos e fontes
  hooks/       # estado e comportamento compartilhado
  pages/       # telas principais da aplicacao
  styles/      # estilos globais
  utils/       # engine de preco e insights
```

Pontos importantes de implementacao:

- a busca usa simulacao de chamadas em lote com progresso por fonte
- os precos sao deterministas por semente para manter consistencia entre renders
- favoritos, alertas e contador de chamadas ficam persistidos no navegador
- as paginas sao carregadas com lazy loading para reduzir custo inicial

## Como Funciona o Insight de Compra

O motor calcula metricas historicas e classifica a oportunidade com base no preco atual:

- COMPRE AGORA: preco atual muito proximo do minimo historico
- BOA OPORTUNIDADE: preco atual abaixo da media
- PRECO MEDIO: faixa intermediaria
- AGUARDE - PRECO ALTO: preco atual proximo do topo historico

Essa regra fica centralizada no engine para facilitar ajuste fino de thresholds.

## Integrando APIs Reais

Hoje o projeto usa dados simulados para permitir execucao local imediata, sem chave de API.

Para conectar provedores reais:

1. Crie adaptadores de busca por fonte.
2. Normalize a resposta para um formato unico.
3. Substitua a etapa de geracao simulada pela chamada real.
4. Mantenha fallback para dados simulados em caso de falha.

Formato sugerido por item:

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

## Qualidade

- testes unitarios no motor de precos
- base pronta para expandir cobertura de componentes e paginas
- lint para padrao de codigo consistente

## Roadmap Sugerido

- filtros avancados (faixa de preco, categoria, marca)
- historico salvo por produto pesquisado
- comparacao lado a lado entre ofertas
- notificacoes reais de alerta via e-mail/web push
- backend para sincronizar favoritos e alertas entre dispositivos

## Licenca

MIT

## Observacao

Este repositorio usa dados simulados para fins de demonstracao. Os valores exibidos nao representam precos reais em tempo real.
