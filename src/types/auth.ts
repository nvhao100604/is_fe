export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  lastLogin?: string;
  isLocked: boolean;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  loading: boolean;
}
