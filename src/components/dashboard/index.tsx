'use client'
import { MFASettingResponseDTO } from "@/types/response/mfasetting.response.dto";
import { mfaSettingService } from "@/services/mfa-setting.service";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const MfaSettingsPage: React.FC = () => {
  const router = useRouter();
  const [settings, setSettings] = useState<MFASettingResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMfaSettings();
  }, []);

  const loadMfaSettings = async () => {
    try {
      setLoading(true);
      const response = await mfaSettingService.getMfaSettings();
      if (response.success) {
        setSettings(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to load MFA settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMfa = async () => {
    // TODO: Implement toggle MFA functionality
    console.log('Toggle MFA');
  };

  const handleSetupTotp = () => {
    router.push('/auth/mfa/setup-totp');
  };

  const handleSetupEmail = () => {
    router.push('/auth/mfa/setup-email');
  };

  const handleSetupWebAuthn = () => {
    router.push('/auth/mfa/setup-webauthn');
  };

  const handleViewBackupCodes = () => {
    router.push('/auth/mfa/backup-codes');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error || 'Failed to load settings'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Multi-Factor Authentication</h1>
            <p className="mt-1 text-sm text-gray-600">
              Secure your account with additional authentication methods
            </p>
          </div>

          <div className="p-6 space-y-8">
            {/* MFA Status */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">
                  {settings.mfaEnabled ? 'Your account is protected with 2FA' : 'Add an extra layer of security'}
                </p>
              </div>
              <button
                onClick={handleToggleMfa}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${settings.mfaEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.mfaEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>

            {/* Authentication Methods */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Authentication Methods</h3>

              {/* TOTP/Authenticator App */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">Authenticator App</h4>
                      <p className="text-sm text-gray-600">
                        {settings.mfaTotpEnable ? 'Enabled' : 'Use an app like Google Authenticator or Authy'}
                      </p>
                    </div>
                  </div>
                  <div>
                    {settings.mfaTotpEnable ? (
                      <button
                        onClick={() => {/* TODO: Disable TOTP */ }}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Disable
                      </button>
                    ) : (
                      <button
                        onClick={handleSetupTotp}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Set up
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">Email Authentication</h4>
                      <p className="text-sm text-gray-600">
                        {settings.mfaEmailEnabled ? 'Enabled' : 'Receive codes via email'}
                      </p>
                    </div>
                  </div>
                  <div>
                    {settings.mfaEmailEnabled ? (
                      <button
                        onClick={() => {/* TODO: Disable Email MFA */ }}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Disable
                      </button>
                    ) : (
                      <button
                        onClick={handleSetupEmail}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Set up
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* WebAuthn */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">Security Keys</h4>
                      <p className="text-sm text-gray-600">
                        {settings.mfaWebauthnEnabled ? 'Enabled' : 'Use hardware security keys or biometric authentication'}
                      </p>
                    </div>
                  </div>
                  <div>
                    {settings.mfaWebauthnEnabled ? (
                      <button
                        onClick={() => {/* TODO: Disable WebAuthn */ }}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Disable
                      </button>
                    ) : (
                      <button
                        onClick={handleSetupWebAuthn}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Set up
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Backup Codes */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Backup Codes</h3>
                  <p className="text-sm text-gray-600">
                    Recovery codes you can use if you lose access to your primary authentication method
                  </p>
                </div>
                <button
                  onClick={handleViewBackupCodes}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  View Codes
                </button>
              </div>
            </div>

            {/* Settings */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Require MFA for sensitive actions</h3>
                  <p className="text-sm text-gray-600">
                    Require additional authentication for sensitive account changes
                  </p>
                </div>
                <button
                  onClick={() => {/* TODO: Toggle sensitive actions MFA */ }}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${settings.mfaRequiredMfaForSensitiveActions ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.mfaRequiredMfaForSensitiveActions ? 'translate-x-5' : 'translate-x-0'
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MfaSettingsPage;