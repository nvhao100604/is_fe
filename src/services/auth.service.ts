import api from "@/config/axios"
import { LoginRequestDTO, PasswordVerify } from "@/types/request/auth.request.dto"
import { EmailVerification } from "./mail.services"

const authLogIn = async (loginData: LoginRequestDTO): Promise<any> => {
  const response = await api.post("/auth/sign-in",
    loginData,
    { withCredentials: true })
  // console.log("check login response: " + response.data)
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

const verifyPassword = async (password: PasswordVerify): Promise<any> => {
  const response = await api.post("/auth/verify-password", JSON.stringify(password))
  return response.data
}

const sendEmailNotificationVerify = async (): Promise<any> => {
  const response = await api.post("/auth/send-email-notification-verify", {})
  return response.data
}

const verifyEmail = async (emailVerify: EmailVerification): Promise<any> => {
  const response = await api.post("/auth/verify-email", emailVerify)
  return response.data
}

export const authServices = { authLogIn, authGithubSignIn, getCurrentUser, verifyPassword, sendEmailNotificationVerify, verifyEmail }