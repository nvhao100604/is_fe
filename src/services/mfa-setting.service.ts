// import { VerifyDeviceWithTOTP } from "@/types/request/verifydevicewithtotp.dto";
// import { AuthenticationDTO } from "@/types/response/auth.response.dto";
// import { MFASettingResponseDTO } from "@/types/response/mfasetting.response.dto";
// import { APIResponse } from "@/types/api";
// import { BASE_MFA_URL } from "../constants";
// import { configRequest } from "@/config/api/config.api";

import api from "@/config/axios"
import { VerifyDeviceWithTOTP } from "@/types/request/VerifyDeviceWithTotp.dto"
// const BASE_URL = BASE_MFA_URL;

// class MfaSettingService {
//   async verifyDeviceWithToTP(verification: VerifyDeviceWithTOTP): Promise<AuthenticationDTO> {
//     const response = await configRequest.makeAuthenticatedRequest<AuthenticationDTO>(`${BASE_URL}/verify-totp`, {
//       method: 'POST',
//       body: JSON.stringify(verification),
//     });
//     return response.data;
//   }

//   async getMfaSettings(): Promise<APIResponse<MFASettingResponseDTO> | any> {
//     const response = await configRequest.makeAuthenticatedRequest<APIResponse<MFASettingResponseDTO>>(`${BASE_URL}`, {
//       method: 'GET',
//     });
//     return response;
//   }


// }

// export const mfaSettingService = new MfaSettingService();

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
