import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  // 10% das requisições edge geram trace.
  // Antes: 0 (zero observabilidade) — DEBT-H3 do roundtable, consenso 6/6.
  tracesSampleRate: 0.1,
  debug: false,
})
