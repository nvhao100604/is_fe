import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mfaSettingServices } from '@/services/mfa-setting.service';
import { authServices } from '@/services/auth.service';

// Types
interface MfaSettings {
  mfaId: number;
  mfaEnabled: boolean;
  mfaPrimaryMethod: 'EMAIL' | 'TOTP' | 'WEBAUTHN' | 'AUTHENTICATOR_APP' | 'BACKUP_CODES';
  mfaBackupMethod: string | null;
  mfaTotpSecretKey: string | null;
  mfaTotpEnable: boolean;
  mfaEmailEnabled: boolean;
  mfaWebauthnEnabled: boolean;
  mfaAuthenticatorAppEnabled: boolean;
  mfaRequiredMfaForSensitiveActions: boolean;
  mfaUpdatedAt: string;
}

interface MfaVerificationProps {
  action: 'login' | 'password_reset' | 'security_settings' | 'sensitive_action' | string;
  onSuccess: () => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
  username?: string | null;
}

const MfaVerification: React.FC<MfaVerificationProps> = ({
  action,
  onSuccess,
  onCancel,
  title,
  description,
  username
}: MfaVerificationProps) => {
  const router = useRouter();
  const [response, setResponse] = useState<any>();
  const [mfaSettings, setMfaSettings] = useState<MfaSettings | null>(null);
  const [currentMethod, setCurrentMethod] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableMethods, setAvailableMethods] = useState<string[]>([]);

  const isLoginAction = action === 'login';

  useEffect(() => {
    loadMfaSettings();
  }, []);

  // ========================================
  // LOAD MFA SETTINGS & SEND INITIAL EMAIL
  // ========================================
  const loadMfaSettings = async () => {
    try {
      setLoading(true);
      // TODO: API CALL - Send initial email based on action type
      if (isLoginAction) {
        // FOR LOGIN: Send device verification email
        if (username) {
          const formVerify = { username: username };
          // await mailServices.sendVerificationDevice(formVerify);
          console.log('TODO: Send device verification email for login:', formVerify);
        }
      } else {
        // FOR OTHER ACTIONS: Send notification email
        await authServices.sendEmailNotificationVerify();
        console.log('TODO: Send notification email for', action);
      }

      // TODO: API CALL - Get MFA settings
      const formVerify = { username: isLoginAction ? username : null };
      const response = await mfaSettingServices.getMFASetting(formVerify, { option: {} });

      // Mock data for development
      const mockResponse = {
        success: true,
        data: {
          mfaId: 4,
          mfaEnabled: true,
          mfaPrimaryMethod: 'EMAIL' as const,
          mfaBackupMethod: null,
          mfaTotpSecretKey: null,
          mfaTotpEnable: true,
          mfaEmailEnabled: true,
          mfaWebauthnEnabled: false,
          mfaAuthenticatorAppEnabled: false,
          mfaRequiredMfaForSensitiveActions: false,
          mfaUpdatedAt: '2025-09-22T02:01:11'
        }
      };

      if (response.success) {
        setMfaSettings(response.data);
        setCurrentMethod(response.data.mfaPrimaryMethod);

        // Build available methods based on action type
        const methods = buildAvailableMethods(response.data, isLoginAction);
        setAvailableMethods(methods);
      }

    } catch (err) {
      setError('Failed to load MFA settings');
      console.error('Load MFA settings error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // BUILD AVAILABLE METHODS
  // ========================================
  const buildAvailableMethods = (settings: MfaSettings, isLogin: boolean): string[] => {
    const methods: string[] = [];

    // Add enabled MFA methods
    if (settings.mfaEmailEnabled) methods.push('EMAIL');
    if (settings.mfaTotpEnable) methods.push('TOTP');
    if (settings.mfaWebauthnEnabled) methods.push('WEBAUTHN');
    if (settings.mfaAuthenticatorAppEnabled) methods.push('AUTHENTICATOR_APP');

    // Add fallback methods (NOT for login)
    if (!isLogin) {
      //methods.push('BACKUP_CODES');
      methods.push('PASSWORD');
    }

    return methods;
  };

  // ========================================
  // VERIFICATION HANDLERS
  // ========================================
  const handleVerification = async () => {
    if (!verificationCode.trim()) return;

    try {
      setLoading(true);
      setError(null);

      switch (currentMethod) {
        case 'EMAIL':
          const emailResponse = await handleEmailVerification();
          setResponse(emailResponse)
          break;

        case 'TOTP':
        case 'AUTHENTICATOR_APP':
          const authResponse = await handleTOTPVerification();
          setResponse(authResponse)
          break;

        case 'WEBAUTHN':
          const webAuthResponse = await handleWebAuthnVerification();
          setResponse(webAuthResponse)
          break;

        case 'BACKUP_CODES':
          const backUpResponse = await handleBackupCodeVerification();
          setResponse(backUpResponse)
          break;

        case 'PASSWORD':
          const pwdResponse = await handlePasswordVerification();
          console.log("pwd res check:", pwdResponse)
          setResponse(pwdResponse)
          if (pwdResponse && pwdResponse.success) {
            onSuccess();
          } else {
            setError(pwdResponse?.message || 'Password verification failed');
          }
          break;

        default:
          throw new Error('Unsupported verification method');
      }

      // Handle response
      // if (response.success) {
      //   if (isLoginAction && response.data) {
      //     localStorage.setItem('accessToken', response.token);
      //     localStorage.setItem('refreshToken', response.refreshToken);
      //     document.cookie = `accessToken=${response.token}; Path=/; SameSite=Strict`;
      //   }
      //   onSuccess();
      // } else {
      //   setError(response?.message || 'Verification failed. Please try again.');
      // }

    } catch (err) {
      setError('Verification failed. Please try again.');
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // EMAIL VERIFICATION
  // ========================================
  const handleEmailVerification = async () => {
    if (isLoginAction) {
      // TODO: API CALL - Login email verification
      const payload = {
        username: username ?? "",
        otp: verificationCode,
      };
      console.log('TODO: Login email verification:', payload);
      // return await mailServices.verificationDevice(payload);

      // Mock response
      return {
        success: true,
        data: true,
        token: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      };
    } else {
      // TODO: API CALL - General email verification
      const payload = {
        email: null,
        otp: verificationCode,
      };
      console.log('TODO: General email verification:', payload);
      // return await mailServices.verifySignUp(payload);

      // Mock response
      return { success: true, data: true };
    }
  };

  // ========================================
  // TOTP VERIFICATION
  // ========================================
  const handleTOTPVerification = async () => {
    if (isLoginAction) {
      // TODO: API CALL - Login TOTP verification
      const payload = {
        username: username ?? "",
        totpVerificationDTO: {
          code: verificationCode,
        }
      };
      console.log('TODO: Login TOTP verification:', payload);
      // return await mfaSettingServices.verifyTOTP(payload);

      // Mock response
      return {
        success: true,
        mfaRequired: false,
        token: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      };
    } else {
      // TODO: API CALL - General TOTP verification
      const payload = {
        code: verificationCode,
        action: action
      };
      console.log('TODO: General TOTP verification:', payload);
      // return await mfaSettingServices.verifyTOTPForAction(payload);

      // Mock response
      return { success: true, data: true };
    }
  };

  // ========================================
  // WEBAUTHN VERIFICATION
  // ========================================
  const handleWebAuthnVerification = async () => {
    // TODO: API CALL - WebAuthn verification
    const payload = {
      action: action,
      username: isLoginAction ? username : undefined
    };
    console.log('TODO: WebAuthn verification:', payload);
    // return await mfaSettingServices.verifyWebAuthn(payload);

    // Mock response
    await new Promise(resolve => setTimeout(resolve, 2000))
    return {
      success: true,
      data: true,
      ...(isLoginAction && {
        token: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      })
    }
  };

  // ========================================
  // BACKUP CODE VERIFICATION (Non-login only)
  // ========================================
  const handleBackupCodeVerification = async () => {
    if (isLoginAction) {
      throw new Error('Backup codes not allowed for login');
    }

    // TODO: API CALL - Backup code verification
    const payload = {
      code: verificationCode,
      action: action
    };
    console.log('TODO: Backup code verification:', payload);
    // return await mfaSettingServices.verifyBackupCode(payload);

    // Mock response
    return { success: true, data: true };
  };

  // ========================================
  // PASSWORD VERIFICATION (Non-login only)
  // ========================================
  const handlePasswordVerification = async () => {
    if (isLoginAction) {
      throw new Error('Password verification not allowed for login');
    }

    const payload = {
      password: verificationCode,
    };
    console.log('TODO: Password verification:', payload);

    try {
      const response = await authServices.verifyPassword(payload);
      console.log('Password verification response:', response);

      if (response && response.success) {
        if (response.data) {
          return { success: true, data: true };
        } else {
          return { success: false, message: 'Incorrect password' };
        }
      } else {
        return { success: false, message: response?.message || 'Password verification failed' };
      }
    } catch (error) {
      // console.error("Error during password verification:", error);
      // return { success: false, message: 'An unexpected error occurred.' };
    }
  };

  // ========================================
  // SEND EMAIL CODE (Resend)
  // ========================================
  const sendEmailCode = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isLoginAction) {
        // TODO: API CALL - Resend device verification email
        const payload = {
          username: username ?? "",
        };
        console.log('TODO: Resend device verification email:', payload);
        // await mailServices.sendVerificationDevice(payload);
      } else {
        // TODO: API CALL - Resend notification email
        console.log('TODO: Resend notification email for', action);
        // await authServices.sendEmailNotificationVerify();
      }

      // Show success message
      console.log('Email code sent successfully');

    } catch (err) {
      setError('Failed to send email code');
      console.error('Send email error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // WEBAUTHN HANDLER
  // ========================================
  const handleWebAuthn = async () => {
    try {
      setLoading(true);
      const response = await handleWebAuthnVerification();

      if (response.success) {
        if (isLoginAction && response.token) {
          localStorage.setItem('accessToken', response.token);
          // localStorage.setItem('refreshToken', response.refreshToken);
          document.cookie = `accessToken=${response.token}; Path=/; SameSite=Strict`;
        }
        onSuccess();
      } else {
        setError('WebAuthn verification failed');
      }
    } catch (err) {
      setError('WebAuthn verification failed');
      console.error('WebAuthn error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // SWITCH METHOD
  // ========================================
  const switchMethod = (method: string) => {
    setCurrentMethod(method);
    setVerificationCode('');
    setError(null);

    // Auto-send email when switching to email method
    if (method === 'EMAIL') {
      sendEmailCode();
    }
  };

  // ========================================
  // UI HELPER FUNCTIONS
  // ========================================
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'EMAIL':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'TOTP':
      case 'AUTHENTICATOR_APP':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'WEBAUTHN':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
          </svg>
        );
      case 'BACKUP_CODES':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'PASSWORD':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'EMAIL':
        return 'Email Authentication';
      case 'TOTP':
        return 'Authenticator App (TOTP)';
      case 'AUTHENTICATOR_APP':
        return 'Authenticator App';
      case 'WEBAUTHN':
        return 'Security Key';
      case 'BACKUP_CODES':
        return 'Backup Codes';
      case 'PASSWORD':
        return 'Account Password';
      default:
        return method;
    }
  };

  const getMethodDescription = (method: string) => {
    switch (method) {
      case 'EMAIL':
        return `Enter the 6-digit code sent to your email${isLoginAction ? ' for device verification' : ''}`;
      case 'TOTP':
      case 'AUTHENTICATOR_APP':
        return 'Enter the 6-digit code from your authenticator app';
      case 'WEBAUTHN':
        return 'Use your security key or biometric authentication';
      case 'BACKUP_CODES':
        return 'Enter one of your backup recovery codes';
      case 'PASSWORD':
        return 'Enter your account password as a last resort';
      default:
        return 'Complete verification to continue';
    }
  };

  const getActionTitle = () => {
    if (title) return title;

    switch (action) {
      case 'login':
        return 'Device Verification Required';
      case 'password_reset':
        return 'Verify Identity for Password Reset';
      case 'security_settings':
        return 'Verify Identity for Security Changes';
      case 'sensitive_action':
        return 'Additional Authentication Required';
      default:
        return 'Two-Factor Authentication';
    }
  };

  const getActionDescription = () => {
    if (description) return description;

    switch (action) {
      case 'login':
        return 'This is your first login on a new device. Please complete verification to access your account.';
      case 'password_reset':
        return 'For security purposes, please verify your identity before resetting your password.';
      case 'security_settings':
        return 'Additional verification is required to modify security settings.';
      case 'sensitive_action':
        return 'This action requires additional authentication for security.';
      default:
        return 'Please complete verification to continue.';
    }
  };

  // ========================================
  // LOADING & ERROR STATES
  // ========================================
  if (loading && !mfaSettings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!mfaSettings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">Failed to load MFA settings</p>
        </div>
      </div>
    );
  }

  // ========================================
  // MAIN RENDER
  // ========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{getActionTitle()}</h1>
          <p className="text-gray-600 text-sm">{getActionDescription()}</p>
          {isLoginAction && username && (
            <p className="text-gray-500 text-xs mt-2">Signed in as: <span className="font-medium">{username}</span></p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Current Method Display */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              {getMethodIcon(currentMethod)}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">{getMethodLabel(currentMethod)}</h3>
              <p className="text-xs text-gray-600">{getMethodDescription(currentMethod)}</p>
            </div>
          </div>

          {/* Verification Input */}
          {currentMethod === 'WEBAUTHN' ? (
            <button
              onClick={handleWebAuthn}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Use Security Key'}
            </button>
          ) : currentMethod === 'PASSWORD' ? (
            <>
              <input
                type="password"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                maxLength={128}
              />

              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="text-sm">
                    <p className="text-amber-800 font-medium">Security Notice</p>
                    <p className="text-amber-700 mt-1">
                      Using password authentication reduces your account security.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleVerification}
                disabled={loading || !verificationCode || verificationCode.length < 6}
                className="w-full mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify with Password'}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono"
                placeholder={currentMethod === 'BACKUP_CODES' ? 'XXXXXXXX' : '123456'}
                maxLength={currentMethod === 'BACKUP_CODES' ? 8 : 6}
              />

              <button
                onClick={handleVerification}
                disabled={loading || !verificationCode || (currentMethod !== 'BACKUP_CODES' && verificationCode.length !== 6) || (currentMethod === 'BACKUP_CODES' && verificationCode.length !== 8)}
                className="w-full mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </>
          )}
        </div>

        {/* Alternative Methods */}
        {availableMethods.length > 1 && (
          <div className="border-t pt-6">
            <p className="text-sm text-gray-600 mb-4">
              Having trouble? Try another method:
            </p>
            <div className="space-y-2">
              {availableMethods
                .filter(method => method !== currentMethod)
                .sort((a, b) => {
                  if (a === 'PASSWORD') return 1;
                  if (b === 'PASSWORD') return -1;
                  return 0;
                })
                .map((method) => (
                  <button
                    key={method}
                    onClick={() => switchMethod(method)}
                    className={`w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md border border-gray-200 ${method === 'PASSWORD' ? 'border-amber-200 bg-amber-50' : ''
                      }`}
                  >
                    <div className={`w-6 h-6 text-gray-500 mr-3 ${method === 'PASSWORD' ? 'text-amber-600' : ''}`}>
                      {getMethodIcon(method)}
                    </div>
                    <div className="flex-1 text-left">
                      <span className={method === 'PASSWORD' ? 'text-amber-800' : ''}>{getMethodLabel(method)}</span>
                      {method === 'PASSWORD' && (
                        <p className="text-xs text-amber-700 mt-1">Last resort</p>
                      )}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Resend Email Code */}
        {currentMethod === 'EMAIL' && (
          <div className="mt-4 text-center">
            <button
              onClick={sendEmailCode}
              className="text-sm text-blue-600 hover:text-blue-800"
              disabled={loading}
            >
              Resend email code
            </button>
          </div>
        )}

        {/* Cancel */}
        {onCancel && (
          <div className="mt-6 text-center">
            <button
              onClick={onCancel}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel and go back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { MfaVerification };