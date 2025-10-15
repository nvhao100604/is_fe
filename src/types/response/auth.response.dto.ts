import { tempUser, UserDTO } from "./user.response.dto";

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
  accountId?: string;
  accountUsername?: string;
  accountEmail?: string;
  accountLastLogin?: string;
  accountIsLocked?: boolean;
  accountCreatedAt?: string;
  accountLockedTime?: string;
  user?: UserDTO;
}

export const tempAccount: AccountResponseDTO = {
  accountId: undefined,
  accountUsername: undefined,
  accountEmail: undefined,
  accountLastLogin: undefined,
  accountIsLocked: undefined,
  accountCreatedAt: undefined,
  user: undefined
} 