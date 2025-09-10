export interface MFASettingResponseDTO {
  mfaId: number;
  mfaEnabled: boolean;
  mfaPrimaryMethod: string;
  mfaBackupMethod: string;
  mfaTotpEnable: boolean;
  mfaEmailEnabled: boolean;
  mfaWebauthnEnabled: boolean;
  mfaAuthenticatorAppEnabled: boolean;
  mfaRequiredMfaForSensitiveActions: boolean;
  mfaUpdatedAt: string;
}
