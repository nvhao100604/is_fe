export interface TrustDeviceDTO {
  trustDeviceId: number;
  trustDeviceName: string;
  deviceIpAddress: string;
  deviceUserAgent: string;
  deviceLocation: string;
  deviceIsActive: boolean;
  deviceIsVerified: boolean;
  deviceCreatedAt: string;
  deviceUpdatedAt: string;
}
