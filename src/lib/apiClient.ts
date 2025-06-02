
import { config } from './config';
import { rateLimiter } from './rateLimiter';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiOptions {
  timeout?: number;
  retries?: number;
  rateLimitKey?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit & ApiOptions = {}
  ): Promise<T> {
    const {
      timeout = config.api.timeout,
      retries = config.api.retryAttempts,
      rateLimitKey,
      ...fetchOptions
    } = options;

    // Rate limiting check
    if (rateLimitKey) {
      const limit = config.rateLimits[rateLimitKey as keyof typeof config.rateLimits];
      if (limit && !rateLimiter.check(`api:${rateLimitKey}`, limit.maxAttempts, limit.windowMs)) {
        const remainingTime = rateLimiter.getRemainingTime(`api:${rateLimitKey}`);
        throw new ApiError(
          `Rate limit exceeded. Please try again in ${Math.ceil(remainingTime / 1000)} seconds.`,
          429,
          'RATE_LIMIT_EXCEEDED'
        );
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const requestOptions: RequestInit = {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    };

    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, requestOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(
            errorData.message || errorData.error || `HTTP ${response.status}`,
            response.status,
            errorData.code
          );
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < retries && this.shouldRetry(error as Error)) {
          await this.delay(config.api.retryDelay * Math.pow(2, attempt));
          continue;
        }
        
        break;
      }
    }

    clearTimeout(timeoutId);
    throw lastError!;
  }

  private shouldRetry(error: Error): boolean {
    if (error.name === 'AbortError') return false;
    if (error instanceof ApiError) {
      return error.status ? error.status >= 500 : false;
    }
    return true;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public get<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.makeRequest(endpoint, { method: 'GET', ...options });
  }

  public post<T>(endpoint: string, data?: any, options?: ApiOptions): Promise<T> {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  public put<T>(endpoint: string, data?: any, options?: ApiOptions): Promise<T> {
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  public delete<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.makeRequest(endpoint, { method: 'DELETE', ...options });
  }
}

export const apiClient = new ApiClient(config.serverUrl);
