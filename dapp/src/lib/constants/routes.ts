export const routes = {
  dashboard: '/',
  invest: '/invest',
  portfolio: '/portfolio'
} as const;

export const api = {
  getMarketMetrics: '/api/get-market-metrics',
  getMarketSentiment: '/api/get-market-sentiment'
} as const;

export const tokenMetrics = {
  api: 'https://api.tokenmetrics.com/v2'
} as const;
