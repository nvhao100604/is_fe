/* eslint-disable @typescript-eslint/no-explicit-any */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });

  failedQueue = [];
};

const setupInterceptors = () => {
  // Request interceptor
  const originalFetch = window.fetch;
  window.fetch = async (url: RequestInfo | URL, options: RequestInit = {}) => {
    const token = localStorage.getItem('accessToken');

    let headers: Record<string, string> = {};

    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else if (options.headers) {
      headers = { ...options.headers as Record<string, string> };
    }

    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    options.headers = headers;

    const response = await originalFetch(url, options);

    // Handle 401 responses
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken && !isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken(refreshToken);
          processQueue(null, newToken);

          // Retry the original request with new token
          const retryOptions = {
            ...options,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${newToken}`,
            },
          };

          return originalFetch(url, retryOptions);
        } catch (error) {
          processQueue(error, null);

          // Redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth/login';

          throw error;
        } finally {
          isRefreshing = false;
        }
      }
    }

    return response;
  };
};

const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  localStorage.setItem('accessToken', data.token);

  return data.token;
};

export { setupInterceptors }