import { API_BASE_URL, BASE_TOKEN_URL } from "@/constants";
import { APIResponse } from "@/types/api";
import { AuthenticationDTO } from "@/types/response/auth.response.dto";

class TokenService {
  private static readonly BASE_URL = BASE_TOKEN_URL;

  async refreshTokens(refreshToken: string): Promise<AuthenticationDTO> {
    const response = await fetch(`${API_BASE_URL}${TokenService.BASE_URL}/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Token refresh failed');
    }

    return data.data;
  }
}

class ConfigRequest {
  private tokenService = new TokenService();
  private isRefreshing = false;
  private refreshPromise: Promise<AuthenticationDTO> | null = null;

  public async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    // Try the original request first
    try {
      return await this.executeRequest<T>(endpoint, options);
    } catch (error: any) {
      // Check if it's a 401 error and we have a refresh token
      if (error.status === 401 && this.hasRefreshToken()) {
        try {
          // Handle token refresh
          await this.handleTokenRefresh();

          // Retry the original request with new token
          return await this.executeRequest<T>(endpoint, options);
        } catch (refreshError) {
          // Token refresh failed, redirect to login
          this.handleAuthenticationFailure();
          throw refreshError;
        }
      }

      throw error;
    }
  }

  private async executeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add auth token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'API request failed') as any;
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  private hasRefreshToken(): boolean {
    return !!localStorage.getItem('refreshToken');
  }

  private async handleTokenRefresh(): Promise<void> {
    // Prevent multiple concurrent refresh attempts
    if (this.isRefreshing && this.refreshPromise) {
      await this.refreshPromise;
      return;
    }

    this.isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      console.log('🔄 Refreshing access token...');

      this.refreshPromise = this.tokenService.refreshTokens(refreshToken);
      const authData = await this.refreshPromise;

      // Update tokens in localStorage
      localStorage.setItem('accessToken', authData.token);
      localStorage.setItem('refreshToken', authData.refreshToken);

      // Update any other auth data if needed
      if (authData.username) {
        localStorage.setItem('username', authData.username);
      }

      if (authData.deviceId) {
        localStorage.setItem('deviceId', authData.deviceId.toString());
      }

      console.log('✅ Token refreshed successfully');

    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      throw error;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private handleAuthenticationFailure(): void {
    console.log('🚪 Authentication failed, redirecting to login...');

    // Clear all auth data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('deviceId');

    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Helper method to check if user is authenticated
  public isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // Helper method to get current user info
  public getCurrentUser(): { username?: string; deviceId?: string } | null {
    if (!this.isAuthenticated()) {
      return null;
    }

    return {
      username: localStorage.getItem('username') || undefined,
      deviceId: localStorage.getItem('deviceId') || undefined,
    };
  }

  // Helper method to manually logout
  public logout(): void {
    this.handleAuthenticationFailure();
  }

  // Method to make authenticated requests with better error handling
  public async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    if (!this.isAuthenticated()) {
      this.handleAuthenticationFailure();
      throw new Error('User not authenticated');
    }

    try {
      const response = await this.makeRequest<T>(endpoint, options);
      return response;
    } catch (error: any) {
      // Log error for debugging
      console.error(`API Request failed [${options.method || 'GET'}] ${endpoint}:`, error);
      throw error;
    }
  }
}

export const configRequest = new ConfigRequest();

// Export for use in components
export { TokenService };