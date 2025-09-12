import api from "@/config/axios"

export interface EmailVerification {
    email: string,
    otp: string
}
const verifySignUp = async (emailVerification: EmailVerification): Promise<any> => {
    const response = await api.post("/mail/verified-signup", emailVerification)
    return response.data
}

export const mailServices = {
    verifySignUp
}