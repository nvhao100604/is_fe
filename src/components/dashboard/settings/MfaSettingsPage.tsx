'use client'
import { useGetMFASettings } from "@/hooks/auth/auth.hooks";
import Link from "next/link";
import { MethodBox } from "./settings.components";

const MfaSettingsPage = () => {
  const { mfaSetting, isLoading, errors } = useGetMFASettings()

  const handleToggleMfa = async () => {
    // TODO: Implement toggle MFA functionality
    console.log('Toggle MFA');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (errors) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{errors || 'Failed to load mfaSetting'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {mfaSetting &&
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
                    {mfaSetting.mfaEnabled ? 'Your account is protected with 2FA' : 'Add an extra layer of security'}
                  </p>
                </div>
                <button
                  onClick={handleToggleMfa}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${mfaSetting.mfaEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${mfaSetting.mfaEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                  />
                </button>
              </div>

              {/* Authentication Methods */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Authentication Methods</h3>
                <MethodBox mfaSetting={mfaSetting}
                  href={"/auth/mfa/setup-totp"}
                  handleClick={() => { /* TODO: Handle TOTP setup */ }}
                  handleDisable={() => { /* TODO: Handle TOTP disable */ }}
                />
                <MethodBox mfaSetting={mfaSetting}
                  href={"/auth/mfa/setup-email"}
                  handleClick={() => { /* TODO: Handle Email setup */ }}
                  handleDisable={() => { /* TODO: Handle Email disable */ }}
                />
                <MethodBox mfaSetting={mfaSetting}
                  href={"/auth/mfa/setup-webauthn"}
                  handleClick={() => { /* TODO: Handle WebAuthn setup */ }}
                  handleDisable={() => { /* TODO: Handle WebAuthn disable */ }}
                />
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
                    // onClick={handleViewBackupCodes}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Link href={"/auth/mfa/backup-codes"}>View Codes</Link>
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
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${mfaSetting.mfaRequiredMfaForSensitiveActions ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${mfaSetting.mfaRequiredMfaForSensitiveActions ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>}
      </div>

      { }
    </div>
  );
};

export default MfaSettingsPage;