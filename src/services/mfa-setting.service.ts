import api from "@/config/axios"

interface VerifyDeviceWithTOTP {
    username?: string;
    deviceId?: number;
    totpVerificationDTO?: {
        code?: string;
        secretKey?: string
    }
}

export interface FormVerify{
    username?: string | null;
    password?: string | null;
}

const verifyTOTP = async (request: VerifyDeviceWithTOTP): Promise<any> => {
    const response = await api.post('/mfa-settings/verify-totp', request)
    return response.data
}

const getMFASetting = async (formVerify: FormVerify | null,option?: object): Promise<any> => {
    const response = await api.post('/mfa-settings', formVerify, option)
    return response.data
}

const updateMFASetting = async (mfaId: number, data: object, option?: object) => {
    const response = await api.patch(`/mfa-settings?mfaId=${mfaId}`, data, option)
    // console.log(response);
    return response.data
}

export const mfaSettingServices = {
    verifyTOTP,
    getMFASetting,
    updateMFASetting
}
