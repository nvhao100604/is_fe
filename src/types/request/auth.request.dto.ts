export interface LoginRequestDTO {
  username: string;
  password: string;
}

export interface RegisterRequestDTO {
  fullName: string;
  username: string;
  password: string;
  email: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface ForgotPasswordRequestDTO {
  username: string;
  email: string;
}

export interface VerifyOTPRequestDTO {
  otp: string;
  token?: string;
}

export interface PasswordVerify {
  password: string;
}