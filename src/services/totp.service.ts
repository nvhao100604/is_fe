
import api from "@/config/axios"
import { it } from "node:test";

const BASE_TOTP_URL = "/totp"
const BASE_NATOTP_URL = "/na-totp"

export interface TOTPVerificationDTO {
    code: string;
}

export interface TOTPVerificationAuth {
    email: string;
    otp: string;
}

const registerToTp = async (): Promise<any> => {
    const response = await api.post(`${BASE_TOTP_URL}/register`)
    return response.data
}

const verifyRegisterTOTP = async (totp: TOTPVerificationDTO): Promise<any> => {
    const response = await api.post(`${BASE_TOTP_URL}/verify-register-totp`, JSON.stringify(totp))
    return response.data
}

const verifyToTp = async (totp: TOTPVerificationDTO): Promise<any> => {
    const response = await api.post(`${BASE_TOTP_URL}/verify`, JSON.stringify(totp))
    return response.data
}

const verifyTotpAuth = async (totp: TOTPVerificationAuth): Promise<any> => {
    const response = await api.post(`${BASE_NATOTP_URL}/verify`, totp)
    return response.data
}

export const totpService = {
    registerToTp,
    verifyToTp,
    verifyRegisterTOTP,
    verifyTotpAuth
}
