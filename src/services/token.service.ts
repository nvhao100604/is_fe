// import { AuthenticationDTO } from "@/types/response/auth.response.dto";
// import { BASE_TOKEN_URL } from "../constants";
// import { configRequest } from "@/config/api/config.api";

import api from "@/config/axios"

// const BASE_URL = BASE_TOKEN_URL;

// class TokenService {
//   async refreshTokens(refreshToken: string): Promise<AuthenticationDTO> {
//     const response = await configRequest.makeRequest<AuthenticationDTO>(`${BASE_URL}/refresh-token`, {
//       method: 'POST',
//       body: JSON.stringify({ refreshToken: refreshToken }),
//     });
//     return response.data;
//   }
// }

// export const tokenService = new TokenService()

const refreshToken = () => {
    return api.post('/tokens/refresh-token', {}, { withCredentials: true });
};

export const tokenService = { refreshToken }