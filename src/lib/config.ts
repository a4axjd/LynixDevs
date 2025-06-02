
export const config = {
  serverUrl: import.meta.env.VITE_SERVER_URL || 'http://localhost:3001',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // API Configuration
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },
  
  // Rate limiting (client-side tracking)
  rateLimits: {
    contactForm: {
      maxAttempts: 3,
      windowMs: 60000, // 1 minute
    },
    newsletter: {
      maxAttempts: 2,
      windowMs: 300000, // 5 minutes
    },
    emailSend: {
      maxAttempts: 5,
      windowMs: 600000, // 10 minutes
    },
  },
  
  // File upload limits
  uploads: {
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  },
  
  // Security headers
  security: {
    contentSecurityPolicy: import.meta.env.PROD ? {
      'default-src': "'self'",
      'script-src': "'self' 'unsafe-inline'",
      'style-src': "'self' 'unsafe-inline'",
      'img-src': "'self' data: https:",
      'connect-src': "'self' https://ainlafmvlldgkvwdltkf.supabase.co",
    } : null,
  },
} as const;

// Environment validation
const requiredEnvVars = [
  'VITE_SERVER_URL',
] as const;

export function validateEnvironment() {
  const missing = requiredEnvVars.filter(
    (envVar) => !import.meta.env[envVar] && import.meta.env.PROD
  );
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
