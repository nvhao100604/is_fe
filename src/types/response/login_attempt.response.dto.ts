
export interface LoginAttemptDTO {
  attemptId: number;
  attemptIpAddress: string;
  attemptSuccess: boolean;
  attemptUserAgent: boolean;
  attemptFailureReason: string | null;
  attemptCreatedAt: string;
  trustDeviceName: string | null;
  trustDeviceIpAddress: string | null;

}
