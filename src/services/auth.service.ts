// import { ForgotPasswordRequestDTO, LoginRequestDTO, RegisterRequestDTO } from "@/types/request/auth.request.dto";
// import { AccountResponseDTO, AuthenticationDTO } from "@/types/response/auth.response.dto";
// import { BASE_AUTH_URL } from "../constants";
// import { configRequest } from "@/config/api/config.api";

import api from "@/config/axios"
import { LoginRequestDTO } from "@/types/request/auth.request.dto"

// const BASE_URL = BASE_AUTH_URL;

// class AuthService {

//   async login(credentials: LoginRequestDTO): Promise<AuthenticationDTO> {
//     const response = await configRequest.makeRequest<AuthenticationDTO>(`${BASE_URL}/sign-in`, {
//       method: 'POST',
//       body: JSON.stringify(credentials),
//     });
//     return response.data;
//   }

//   async loginWithGithub(authCode: string): Promise<AuthenticationDTO> {
//     const response = await configRequest.makeRequest<AuthenticationDTO>(`${BASE_URL}/github`, {
//       method: 'POST',
//       body: JSON.stringify({
//         authorizationCode: authCode,
//         redirectUri: 'http://localhost:3000/auth/oauth-callback',
//       }),
//     });
//     return response.data;
//   }

//   async getCurrentUser(): Promise<AccountResponseDTO> {
//     const response = await configRequest.makeRequest<AccountResponseDTO>(`${BASE_URL}/me`);
//     return response.data;
//   }

//   async forgotPassword(data: ForgotPasswordRequestDTO): Promise<void> {
//     await configRequest.makeRequest('/auth/forgot-password', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }

//   async verifyEmail(otp: string): Promise<void> {
//     await configRequest.makeRequest('/accounts/verify-email', {
//       method: 'POST',
//       body: JSON.stringify({ otp }),
//     });
//   }

//   async resetPassword(data: { otp: string; newPassword: string }): Promise<void> {
//     await configRequest.makeRequest('/accounts/reset-password', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }
// }

// export const authService = new AuthService();

const authLogIn = async (loginData: LoginRequestDTO): Promise<any> => {
  const response = await api.post("/auth/sign-in", loginData)
  return response.data
}

const authGithubSignIn = async (authCode: string): Promise<any> => {
  const response = await api.post("/auth/github", {
    authorizationCode: authCode,
    redirectUri: 'http://localhost:3000/auth/oauth-callback',
  })

  return response.data
}

const getCurrentUser = async (): Promise<any> => {
  const response = await api.get("/user")
  return response.data
}

export const authServices = { authLogIn, authGithubSignIn, getCurrentUser }