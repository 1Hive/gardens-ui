import { Severity, captureMessage } from '@sentry/browser'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import env from './environment'
import { getNetworkType } from './utils/web3-utils'

export const sentryEnabled = Boolean(env('SENTRY_DSN'))

export default function initializeSentry() {
  if (sentryEnabled) {
    Sentry.init({
      dsn: env('SENTRY_DSN'),
      integrations: [new Integrations.BrowserTracing()],
      environment: `${env('VERCEL_ENV')}@${getNetworkType()}`,
      //   release: 'gardens-ui@' + env('VERCEL_ENV'),

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    })
    // Add more info context, but it not can be searchable.
    // Sentry.setContext('Git User', {
    //   name: 'Felipe',
    //   email: 'windholyghost@gmail.com',
    // })
  }
}

export function logWithSentry(message: string, level = Severity.Warning) {
  if (sentryEnabled) {
    captureMessage(message, {
      // We too could sent tags to be searchable.
      //   tags: {
      //     gitDeveloper: '',
      //   },
      level,
    })
  }
}
