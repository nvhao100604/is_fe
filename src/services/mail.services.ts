import api from "@/config/axios"

export interface EmailVerification {
    email: string,
    otp: string
}

export interface EmailResendOTP {
    email: string
}
const verifySignUp = async (emailVerification: EmailVerification): Promise<any> => {
    const response = await api.post("/mail/verified-signup", emailVerification)
    return response.data
}

const sendVerificationEmail = async (email: EmailResendOTP): Promise<any> => {
    const response = await api.post("/mail/send-verification", JSON.stringify(email))
    return response.data
}

export const mailServices = {
    verifySignUp,
    sendVerificationEmail
}