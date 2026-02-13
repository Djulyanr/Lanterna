import { z } from 'zod';
import { insertPreferencesSchema } from './schema';

export const api = {
  preferences: {
    // Optional sync endpoint for the future
    sync: {
      method: 'POST' as const,
      path: '/api/preferences',
      input: insertPreferencesSchema,
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
