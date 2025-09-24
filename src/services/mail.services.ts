import api from "@/config/axios"
import { FormVerify } from "./mfa-setting.service"

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
    const response = await api.post("/mail/verified-signup", emailVerification)
    return response.data
}

const sendVerificationEmail = async (email: EmailResendOTP): Promise<any> => {
    const response = await api.post("/mail/send-verification", JSON.stringify(email))
    return response.data
}

const sendVerificationDevice = async (email: FormVerify): Promise<any> => {
    const response = await api.post("/mail/send-email-device", JSON.stringify(email))
    return response.data
}

const verificationDevice = async (email: EmailVerificationDevice): Promise<any> => {
    const response = await api.post("/mail/verify-email-device", JSON.stringify(email))
    return response.data
}

export const mailServices = {
    verifySignUp,
    sendVerificationEmail,
    sendVerificationDevice,
    verificationDevice
}