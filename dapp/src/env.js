/* eslint-disable unicorn/prevent-abbreviations */

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENT_VAR: z.string(),
    NEXT_PUBLIC_ONCHAINKIT_API_KEY: z.string().length(32),
    NEXT_PUBLIC_PYTHON_BACKEND_URL: z.string().url()
  },
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    // SERVER_VAR: z.string(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PYTHON_BACKEND_URL: z.string().url(),
    TOKEN_METRICS_API_KEY: z.string(),
    COIN_MARKET_CAP_API_KEY: z.string()
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes
   * (e.g. middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    // client
    NEXT_PUBLIC_ONCHAINKIT_API_KEY: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY,
    NEXT_PUBLIC_PYTHON_BACKEND_URL: process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL,
    // server
    NODE_ENV: process.env.NODE_ENV,
    PYTHON_BACKEND_URL: process.env.PYTHON_BACKEND_URL,
    TOKEN_METRICS_API_KEY: process.env.TOKEN_METRICS_API_KEY,
    COIN_MARKET_CAP_API_KEY: process.env.COIN_MARKET_CAP_API_KEY
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true
});
