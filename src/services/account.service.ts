// import { APIResponse } from '@/types/api';
// import { AccountResponseDTO } from "@/types/response/auth.response.dto";
// import { RegisterRequestDTO } from "@/types/request/auth.request.dto";
// import { BASE_ACCOUNT_URL } from '../constants';
// import { configRequest } from '@/config/api/config.api';

import api from "@/config/axios"
import { RegisterRequestDTO } from "@/types/request/auth.request.dto"

// class AccountService {
//   async getAccountDetails(): Promise<AccountResponseDTO> {
//     const response = await configRequest.makeAuthenticatedRequest<AccountResponseDTO>(`${BASE_ACCOUNT_URL}`, {
//       method: 'GET',
//     });
//     return response.data;
//   }

//   async register(userData: RegisterRequestDTO): Promise<APIResponse<AccountResponseDTO> | any> {
//     console.log('Registering user with data:', userData);
//     // await new Promise(resolve => setTimeout(resolve, 100000))
//     const response = await configRequest.makeAuthenticatedRequest<APIResponse<AccountResponseDTO>>(`${BASE_ACCOUNT_URL}`, {
//       method: 'POST',
//       body: JSON.stringify(userData),
//     });
//     console.log("check response", response)
//     // await new Promise(resolve => setTimeout(resolve, 100000))
//     return response;
//   }

//   /*   async updateAccountDetails(accountData: UpdateAccountRequestDTO): Promise<AccountResponseDTO> {
//       const response = await configRequest.makeRequest<AccountResponseDTO>(`${BASE_URL}/update`, {
//         method: 'PUT',
//         body: JSON.stringify(accountData),
//       });
//       return response.data;
//     } */

//   async deleteAccount(): Promise<void> {
//     await configRequest.makeRequest(`${BASE_ACCOUNT_URL}/delete`, {
//       method: 'DELETE',
//     });
//   }
// }

// export const accountService = new AccountService();

const getAccounts = async (): Promise<any> => {
  const response = await api.get("/accounts")
  return response.data
}

const createAccount = async (accountData: RegisterRequestDTO): Promise<any> => {
  const response = await api.post("/accounts", accountData)
  return response.data
}

export const accountServices = { getAccounts, createAccount }