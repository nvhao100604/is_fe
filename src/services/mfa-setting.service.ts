import api from "@/config/axios"
import { VerifyDeviceWithTOTP } from "@/types/request/VerifyDeviceWithTotp.dto"

const verifyTOTP = async (request: VerifyDeviceWithTOTP): Promise<any> => {
    const response = await api.post('/mfa-settings/verify-totp', request)
    return response.data
}

const getMFASetting = async (option?: object): Promise<any> => {
    const response = await api.get('/mfa-settings', option)
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
