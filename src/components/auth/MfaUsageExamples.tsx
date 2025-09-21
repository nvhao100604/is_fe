import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mfaSettingServices } from '@/services/mfa-setting.service';
import { EmailResendOTP, EmailVerification, mailServices } from '@/services/mail.services';
import { authServices } from '@/services/auth.service';
import { TOASTIFY_ERROR, TOASTIFY_SUCCESS, useToastify } from '@/store/Toastify';

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
}

const MfaVerification: React.FC<MfaVerificationProps> = ({
  action,
  onSuccess,
  onCancel,
  title,
  description
}: MfaVerificationProps) => {
  const toastify = useToastify()
  const router = useRouter();
  const [mfaSettings, setMfaSettings] = useState<MfaSettings | null>(null);
  const [currentMethod, setCurrentMethod] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableMethods, setAvailableMethods] = useState<string[]>([]);

  useEffect(() => {
    loadMfaSettings();
  }, []);

  const loadMfaSettings = async () => {
    try {
      setLoading(true);
      // TODO: Call API to get MFA settings
      const response = await mfaSettingServices.getMFASetting({ option: {} });

      if(response.success) {
        setMfaSettings(response.data);
        setCurrentMethod(response.data.mfaPrimaryMethod);
        const methods = [];
        if (response.data.mfaEmailEnabled){ 
          authServices.sendEmailNotificationVerify();
            methods.push('EMAIL')
          };
        if (response.data.mfaTotpEnable) methods.push('TOTP');
        if (response.data.mfaWebauthnEnabled) methods.push('WEBAUTHN');
        if (response.data.mfaAuthenticatorAppEnabled) methods.push('AUTHENTICATOR_APP');
        methods.push('PASSWORD');
        methods.push('BACKUP_CODES');
        setAvailableMethods(methods);
      }
      // setMfaSettings(response.data);
      
      // const mockSettings: MfaSettings = {
      //   mfaId: 4,
      //   mfaEnabled: true,
      //   mfaPrimaryMethod: 'EMAIL',
      //   mfaBackupMethod: null,
      //   mfaTotpSecretKey: null,
      //   mfaTotpEnable: true,
      //   mfaEmailEnabled: true,
      //   mfaWebauthnEnabled: false,
      //   mfaAuthenticatorAppEnabled: false,
      //   mfaRequiredMfaForSensitiveActions: false,
      //   mfaUpdatedAt: '2025-09-22T02:01:11'
      // };
      
      // setMfaSettings(mockSettings);
      // setCurrentMethod(mockSettings.mfaPrimaryMethod);
      
      // const methods = [];
      // if (mockSettings.mfaEmailEnabled) methods.push('EMAIL');
      // if (mockSettings.mfaTotpEnable) methods.push('TOTP');
      // if (mockSettings.mfaWebauthnEnabled) methods.push('WEBAUTHN');
      // if (mockSettings.mfaAuthenticatorAppEnabled) methods.push('AUTHENTICATOR_APP');
      // methods.push('PASSWORD');
      // methods.push('BACKUP_CODES');
      
      // setAvailableMethods(methods);
      
    } catch (err) {
      setError('Failed to load MFA settings');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!verificationCode.trim()) return;

    try {
      setLoading(true);
      setError(null);

      // TODO: Call API to verify the code based on current method
      // const response = await mfaService.verifyCode({
      //   method: currentMethod,
      //   code: verificationCode,
      //   action: action
      // });
      
      // Mock verification - simulate success after 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success
      onSuccess();
      
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMethod = (method: string) => {
    setCurrentMethod(method);
    setVerificationCode('');
    setError(null);
    
    // If switching to specific methods, trigger their setup/send process
    if (method === 'EMAIL') {
      sendEmailCode();
    }
  };

  const sendEmailCode = async () => {
    try {
      setLoading(true);
      const emailVerify: EmailVerification = { email: null, otp: verificationCode };
      const response = await mailServices.verifySignUp(emailVerify);
      if (response.success) {
        if(response.data) {
          toastify.notify('Verification email sent. Please check your inbox.', TOASTIFY_SUCCESS);
          onSuccess();
        }else{
          toastify.notify('Email verification failed. Please try again.', TOASTIFY_ERROR);
        }
      }
    } catch (err) {
      setError('Failed to send email code');
    } finally {
      setLoading(false);
    }
  };

  const handleWebAuthn = async () => {
    try {
      setLoading(true);
      // TODO: Implement WebAuthn verification
      // const response = await mfaService.verifyWebAuthn({ action });
      console.log('Starting WebAuthn verification...');
      
      // Mock WebAuthn success
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError('WebAuthn verification failed');
      setLoading(false);
    }
  };

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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
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
        return 'Enter the 6-digit code sent to your email';
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
        return 'Two-Factor Authentication Required';
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
        return 'Please complete two-factor authentication to access your account.';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{getActionTitle()}</h1>
          <p className="text-gray-600 text-sm">{getActionDescription()}</p>
        </div>

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

          {/* Verification Input based on method */}
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
                      Using password authentication reduces your account security. We recommend setting up proper two-factor authentication methods.
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
            <p className="text-sm text-gray-600 mb-4">Having trouble? Try another method:</p>
            <div className="space-y-2">
              {availableMethods
                .filter(method => method !== currentMethod)
                .map((method) => (
                  <button
                    key={method}
                    onClick={() => switchMethod(method)}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md border border-gray-200"
                  >
                    <div className="w-6 h-6 text-gray-500 mr-3">
                      {getMethodIcon(method)}
                    </div>
                    <span>{getMethodLabel(method)}</span>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Resend/Help actions */}
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

        {/* Cancel option */}
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

// Usage Examples Component
const MfaUsageExamples: React.FC = () => {
  const [showLoginMfa, setShowLoginMfa] = useState(false);
  const [showPasswordResetMfa, setShowPasswordResetMfa] = useState(false);
  const [showSecurityMfa, setShowSecurityMfa] = useState(false);

  if (showLoginMfa) {
    return (
      <MfaVerification
        action="login"
        onSuccess={() => {
          alert('Login successful!');
          setShowLoginMfa(false);
          // Navigate to dashboard
        }}
        onCancel={() => setShowLoginMfa(false)}
      />
    );
  }

  if (showPasswordResetMfa) {
    return (
      <MfaVerification
        action="password_reset"
        title="Reset Password Verification"
        description="Please verify your identity before we allow you to reset your password."
        onSuccess={() => {
          alert('Verification successful! You can now reset your password.');
          setShowPasswordResetMfa(false);
          // Navigate to password reset form
        }}
        onCancel={() => setShowPasswordResetMfa(false)}
      />
    );
  }

  if (showSecurityMfa) {
    return (
      <MfaVerification
        action="security_settings"
        onSuccess={() => {
          alert('Security settings access granted!');
          setShowSecurityMfa(false);
          // Navigate to security settings
        }}
        onCancel={() => setShowSecurityMfa(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">MFA Verification System Demo</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Login MFA</h3>
            <p className="text-sm text-gray-600 mb-4">
              Verify identity for new device login
            </p>
            <button
              onClick={() => setShowLoginMfa(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Trigger Login MFA
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Password Reset MFA</h3>
            <p className="text-sm text-gray-600 mb-4">
              Verify identity before password reset
            </p>
            <button
              onClick={() => setShowPasswordResetMfa(true)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Trigger Password Reset MFA
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Security Settings MFA</h3>
            <p className="text-sm text-gray-600 mb-4">
              Verify identity for security changes
            </p>
            <button
              onClick={() => setShowSecurityMfa(true)}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
            >
              Trigger Security MFA
            </button>
          </div>
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Implementation Notes</h2>
          <div className="prose text-sm text-gray-600">
            <h3 className="font-semibold text-gray-900">API Calls to Implement:</h3>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><code>loadMfaSettings()</code> - Get user's MFA configuration</li>
              <li><code>sendEmailCode()</code> - Send verification code via email</li>
              <li><code>verifyCode()</code> - Verify entered code for any method</li>
              <li><code>verifyWebAuthn()</code> - Handle WebAuthn verification</li>
            </ul>
            
            <h3 className="font-semibold text-gray-900 mt-4">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Primary method prioritization based on mfaPrimaryMethod</li>
              <li>Fallback to alternative methods when primary is unavailable</li>
              <li>Contextual titles and descriptions based on action type</li>
              <li>Loading states and error handling</li>
              <li>Responsive design with consistent styling</li>
            </ul>
            
            <h3 className="font-semibold text-gray-900 mt-4">Usage:</h3>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`// Login scenario
<MfaVerification
  action="login"
  onSuccess={() => router.push('/dashboard')}
  onCancel={() => router.push('/login')}
/>

// Password reset scenario
<MfaVerification
  action="password_reset"
  onSuccess={() => router.push('/reset-password')}
  onCancel={() => router.push('/forgot-password')}
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MfaUsageExamples;