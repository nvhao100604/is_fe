'use client'
import { useGetMFASettings, useUpdateMFASettings } from "@/hooks/auth/auth.hooks";
import Link from "next/link";
import { MethodBox } from "./settings.components";
import { useState } from "react";
import Modal from "@/components/common/Modal";
import { authServices } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { TOASTIFY_ERROR, TOASTIFY_INFO, TOASTIFY_SUCCESS, useToastify } from "@/store/Toastify";
import MfaUsageExamples, { MfaVerification } from "@/components/auth/MfaVerification";
import { TOTPSetup } from "./setup-totp";



const MfaSettingsPage = () => {
  const toastify = useToastify()
    const router = useRouter()
  const [showVerifyModal, setShowVerifyModal] = useState(false);
const [password, setPassword] = useState("");
const [pendingAction, setPendingAction] = useState<null | (() => void)>(null);
const [errorMessage, setErrorMessage] = useState("");

  const { mfaSettings, isLoading, errors } = useGetMFASettings()

  const [showMfaVerification, setShowMfaVerification] = useState(false);
  const [pendingSetupMethod, setPendingSetupMethod] = useState<'TOTP' | 'EMAIL' | 'WEBAUTHN' | null>(null);
  const updateMFASettings = useUpdateMFASettings()

  console.log(mfaSettings);

  const handleEnableEmail = async () => {
      setPendingSetupMethod('EMAIL');
      setShowMfaVerification(true);
  }

  const handleEnableWebAuthn = async () => {
    console.log('Enable WebAuthn MFA');
  }

  const handleEnableTOTP = async () => {
    setPendingSetupMethod('TOTP');
      setShowMfaVerification(true);
  }

  const handleDisableEmail = async () => {
    console.log('Disable Email MFA');
  }

  const handleDisableWebAuthn = async () => {
    console.log('Disable WebAuthn MFA');
  }

  const handleDisableTOTP = async () => {
    requirePassword( () => {
      console.log("Disable TOTP MFA");
    });
  }

  const requirePassword = (action: () => void) => {
    setPendingAction(() => action); // lưu action (enable/disable)
    setShowVerifyModal(true);
  };

const verifyPassword = async () => {
  try {
    setErrorMessage("");
    // gọi API verify password
    const res = await authServices.verifyPassword({ password });
    console.log(res);
    if (!res.data) {
      setErrorMessage("Password incorrect");
      return;
    }

    // nếu đúng → chạy tiếp action đã lưu
    if (pendingAction) {
      await pendingAction();
    }

    setShowVerifyModal(false);
    setPassword("");
    setPendingAction(null);
  } catch (err) {
    setErrorMessage("Something went wrong");
  }
};

const onSuccess = async() => {
  if(pendingSetupMethod == 'EMAIL'){
    console.log("Verify Email")
  }
  else if(pendingSetupMethod == 'TOTP'){
    console.log("Verify TOTP")
  }
  else if(pendingSetupMethod == 'WEBAUTHN'){
    console.log("verify WEBAUTHN")
  }
  router.push('/dashboard/setting')
}

const handleMfaVerificationSuccess = () => {
    // After MFA verification succeeds, navigate to setup page
    switch (pendingSetupMethod) {
      case 'TOTP':
        router.push('/auth/mfa/setup-totp');
        break;
      case 'EMAIL':
        router.push('/auth/mfa/setup-email');
        break;
      case 'WEBAUTHN':
        router.push('/auth/mfa/setup-webauthn');
        break;
    }
    setShowMfaVerification(false);
    setPendingSetupMethod(null);
  };

   const handleMfaVerificationCancel = () => {
    setShowMfaVerification(false);
    setPendingSetupMethod(null);
  };

  if (showMfaVerification) {
    return (
      <MfaVerification
        action="security_settings"
        title="Verify Identity for MFA Setup"
        description={`Please verify your identity before setting up ${pendingSetupMethod} authentication.`}
        onSuccess={handleMfaVerificationSuccess}
        onCancel={handleMfaVerificationCancel}
      />
    );
  }



  const handleToggleMfa = async () => {
    // TODO: Implement toggle MFA functionality
    // console.log('Toggle MFA');
    if (mfaSettings) {
      const mfaEnabled =!mfaSettings.mfaEnabled;
      if(mfaEnabled){
        if(!mfaSettings.mfaTotpEnable && !mfaSettings.mfaEmailEnabled && !mfaSettings.mfaWebauthnEnabled){
          toastify.notify("Please enable at least one authentication method before enabling MFA.", TOASTIFY_INFO);
          return;
        }
      }

      updateMFASettings({
        mfaId: mfaSettings.mfaId,
        data: { ...mfaSettings, mfaEnabled: !mfaSettings.mfaEnabled },
        option: { responseDelay: 0 }
      })
    } else {
      console.log("mfaSettings is undefined");
    }
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
          <p className="text-red-600">{errors || 'Failed to load mfaSettings'}</p>
        </div>
      </div>
    );
  }
  if(showVerifyModal){
    return (
      <Modal handleClick={() => setShowVerifyModal(false)}>
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4">Verify your password</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded p-2 mb-2"
        placeholder="Enter your password"
      />
      {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => setShowVerifyModal(false)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>
        <button
          onClick={verifyPassword}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Verify
        </button>
      </div>
    </div>
  </Modal>
    )
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
                  {mfaSettings && mfaSettings.mfaEnabled ? 'Your account is protected with 2FA' : 'Add an extra layer of security'}
                </p>
              </div>
              <button
                onClick={handleToggleMfa}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${mfaSettings?.mfaEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${mfaSettings?.mfaEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>

            {/* Authentication Methods */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Authentication Methods</h3>
              <MethodBox mfaSetting={mfaSettings && mfaSettings}
                href={"/auth/mfa/setup-totp"}
                label="Authenticator App"
                description="Use an app like Google Authenticator or Authy"
                tag="TOTP"
                handleClick={() => { handleEnableTOTP() }}
                handleDisable={() => { handleDisableTOTP() }}
              ><svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </MethodBox>
              <MethodBox mfaSetting={mfaSettings}
                href={"/auth/mfa/setup-email"}
                label="Email Authentication"
                description="Receive codes via email"
                tag="Email"
                handleClick={() => { handleEnableEmail() }}
                handleDisable={() => { handleDisableEmail() }}
              ><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </MethodBox>
              <MethodBox mfaSetting={mfaSettings}
                href={"/auth/mfa/setup-webauthn"}
                label="Security Key (WebAuthn)"
                description="Use hardware security keys or biometric authentication"
                tag="WebAuthn"
                handleClick={() => { handleEnableWebAuthn() }}
                handleDisable={() => { handleDisableWebAuthn() }}
              ><svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </MethodBox>
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
            {/* <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Require MFA for sensitive actions</h3>
                  <p className="text-sm text-gray-600">
                    Require additional authentication for sensitive account changes
                  </p>
                </div>
                <button
                  onClick={() => {/* TODO: Toggle sensitive actions MFA 
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${mfaSettings?.mfaRequiredMfaForSensitiveActions ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${mfaSettings && mfaSettings.mfaRequiredMfaForSensitiveActions ? 'translate-x-5' : 'translate-x-0'
                      }`}
                  />
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      { }
    </div>
  );
};

export default MfaSettingsPage;