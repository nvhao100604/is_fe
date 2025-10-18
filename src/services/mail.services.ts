import api from "@/config/axios"
import { FormVerify } from "./mfa-setting.service"

const BASE_EMAIL_URL = "/mail"
const BASE_NAEMAIL_URL = "/na-mail"

export interface EmailVerification {
    email: string | null,
    otp: string
}

export interface EmailVerificationDevice {
    username: string;
    otp: string;
}

export interface EmailResendOTP {
    email: string | null
}
const verifySignUp = async (emailVerification: EmailVerification): Promise<any> => {
    const response = await api.post(`${BASE_EMAIL_URL}/verified-signup`, emailVerification)
    return response.data
}

const sendVerificationEmail = async (email: EmailResendOTP): Promise<any> => {
    const response = await api.post(`${BASE_EMAIL_URL}/send-verification`, JSON.stringify(email))
    return response.data
}

const sendVerificationDevice = async (email: FormVerify): Promise<any> => {
    const response = await api.post(`${BASE_EMAIL_URL}/send-email-device`, JSON.stringify(email))
    return response.data
}

const verificationDevice = async (email: EmailVerificationDevice): Promise<any> => {
    const response = await api.post(`${BASE_EMAIL_URL}/verify-email-device`, JSON.stringify(email))
    return response.data
}

const emailRequireAuth = async (email: string): Promise<any> => {
    const response = await api.post(`${BASE_NAEMAIL_URL}/require-auth`, { email })
    return response.data
}

const emailVerifyAuth = async (emailVerification: EmailVerification): Promise<any> => {
    const response = await api.post(`${BASE_NAEMAIL_URL}/verify-auth`, emailVerification)
    return response.data
}

export const mailServices = {
    verifySignUp,
    sendVerificationEmail,
    sendVerificationDevice,
    verificationDevice,
    emailRequireAuth,
    emailVerifyAuth
}