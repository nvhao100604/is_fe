'use client'
import { LoginRequestDTO, RegisterRequestDTO } from '@/types/request/auth.request.dto';
import { AccountResponseDTO } from '@/types/response/auth.response.dto';
import { APIResponse } from '@/types/api';
import { useState, useEffect, createContext, useContext } from 'react';
import { accountService } from '@/services/account.service';
import { authService } from '@/services/auth.service';

const AuthContext = createContext<{
  user: AccountResponseDTO | null;
  login: (credentials: LoginRequestDTO) => Promise<boolean | { success: boolean; mfaRequired: boolean; url: string }>;
  register: (userData: RegisterRequestDTO) => Promise<APIResponse<AccountResponseDTO>>;
  logout: () => void;
  loading: boolean;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AccountResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await accountService.getAccountDetails();
      console.log('Loaded user data:', userData);
      setUser({
        accountId: userData.accountId,
        accountUsername: userData.accountUsername,
        accountEmail: userData.accountEmail,
        accountLastLogin: userData.accountLastLogin,
        accountIsLocked: userData.accountIsLocked,
        accountCreatedAt: userData.accountCreatedAt,
        user: {
          userId: userData.user.userId,
          userName: userData.user.userName,
          userGender: userData.user.userGender,
          userDateOfBirth: userData.user.userDateOfBirth,
          userAddress: userData.user.userAddress,
          userPhone: userData.user.userPhone,
          userCreatedAt: userData.user.userCreatedAt,
          userUpdatedAt: userData.user.userUpdatedAt,
        },
      });
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginRequestDTO) => {
    const response = await authService.login(credentials);
    if (response.mfaRequired) {
      sessionStorage.setItem("pendingAuth", JSON.stringify(response));
      let url = '';
      switch (response.mfaMethod) {
        case 'TOTP':
          url = `/auth/mfa/verify-totp`;
          break;

        default:
          break;
      }

      return { success: false, mfaRequired: true, url: url };
    }
    localStorage.setItem('accessToken', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    document.cookie = `accessToken=${response.token}; Path=/; SameSite=Strict`;

    await loadUser();
    return true;
  };

  const register = async (userData: RegisterRequestDTO) => {
    const response = await accountService.register(userData);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    document.cookie = 'accessToken=; Path=/; Max-Age=0';
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};