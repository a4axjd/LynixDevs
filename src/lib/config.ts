
export const config = {
  serverUrl: import.meta.env.VITE_SERVER_URL || 'http://localhost:3001',
  isDevelopment: import.meta.env.VITE_NODE_ENV === 'development',
} as const;
