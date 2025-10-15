
import api from "@/config/axios"

export interface TOTPVerificationDTO {
    code: string;
}

const registerToTp = async (): Promise<any> => {
    const response = await api.post("/totp/register")
    return response.data
}

const verifyRegisterTOTP = async (totp: TOTPVerificationDTO): Promise<any> => {
    const response = await api.post("/totp/verify-register-totp", JSON.stringify(totp))
    return response.data
}

const verifyToTp = async (totp: TOTPVerificationDTO): Promise<any> => {
    const response = await api.post("/totp/verify", JSON.stringify(totp))
    return response.data
}

export const totpService = {
    registerToTp,
    verifyToTp,
    verifyRegisterTOTP
}
