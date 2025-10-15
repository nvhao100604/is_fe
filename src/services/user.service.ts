// import { UserDTO } from '@/types/response/user.response.dto';
// import { BASE_USER_URL } from '../constants';
// import { configRequest } from '@/config/api/config.api';

import api from "@/config/axios"

const BASE_URL = "/user";

// class UserService {
//   async getCurrentUser(): Promise<UserDTO> {
//     const response = await configRequest.makeRequest<UserDTO>(`${BASE_URL}`, {
//       method: 'GET',
//     });
//     return response.data;
//   }
// }

const updateUser = async (userUpdateDTO: any): Promise<any> => {
    const response = await api.patch(`${BASE_URL}`, JSON.stringify(userUpdateDTO));
    return response.data;
}

export const userService = {
    updateUser
}
