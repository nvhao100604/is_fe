import { UserDTO } from "./user.response.dto";

export interface AuthenticationDTO {
  token: string;
  refreshToken: string;
  mfaRequired: boolean;
  deviceId: number;
  username: string;
  message: string;
  mfaMethod: string;
}

export interface AccountResponseDTO {
  accountId: string;
  accountUsername: string;
  accountEmail: string;
  accountLastLogin: string;
  accountIsLocked: boolean;
  accountCreatedAt: string;
  user: UserDTO;
}