
export interface VerifyDeviceWithTOTP {
  username?: string;
  deviceId?: number;
  totpVerificationDTO: {
    code?: string;
    
  }
}