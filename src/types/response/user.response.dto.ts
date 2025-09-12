export interface UserDTO {
  userId?: number;
  userName?: string;
  userGender?: string;
  userDateOfBirth?: string;
  userAddress?: string;
  userPhone?: string;
  userCreatedAt?: string;
  userUpdatedAt?: string;
}

export const tempUser: UserDTO = {
  userId: undefined,
  userName: undefined,
  userGender: undefined,
  userDateOfBirth: undefined,
  userAddress: undefined,
  userPhone: undefined,
  userCreatedAt: undefined,
  userUpdatedAt: undefined,
}
