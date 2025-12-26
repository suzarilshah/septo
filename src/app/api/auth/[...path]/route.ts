import { authApiHandler } from '@neondatabase/neon-js/auth/next';

export const { GET, POST } = authApiHandler({
  config: {
    authUrl: process.env.NEXT_PUBLIC_NEON_AUTH_URL || process.env.NEON_AUTH_BASE_URL || '',
  },
});

