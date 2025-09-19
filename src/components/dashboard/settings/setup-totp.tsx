'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TOTPRegistrationDTO } from '@/types/response/totpregistration.response.dto';

const SetupTotpPage: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<'loading' | 'setup' | 'verify'>('verify');
  const [setupData, setSetupData] = useState<TOTPRegistrationDTO | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeTotp();
  }, []);

  const initializeTotp = async () => {
    try {
      /* const response = await mfaSettingService.getMfaSettings();
      if (response.success) {
        setSetupData(response.data);
        setStep('setup');
      } else {
        setError(response.message);
      } */
    } catch (err) {
      setError('Failed to initialize TOTP setup');
    }
  };

  const handleContinue = () => {
    setStep('verify');
  };

  const handleVerify = async () => {
    if (!setupData || !verificationCode) return;

    try {
      /* setLoading(true);
      setError(null);
      
      const response = await mfaSettingService.verifyAndEnableTotp({
        secret: setupData.secret,
        code: verificationCode
      });

      if (response.success) {
        router.push('/settings/mfa?success=totp-enabled');
      } else {
        setError(response.message);
      } */
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'verify') {
      setStep('setup');
    } else {
      router.back();
    }
  };

  /*   if (step === 'loading') {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    } */

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <button
              onClick={handleBack}
              className="text-sm text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Set up Authenticator App</h1>
            <p className="mt-1 text-sm text-gray-600">
              Step {step === 'setup' ? '1' : '2'} of 2: {step === 'setup' ? 'Scan QR Code' : 'Verify Setup'}
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {step === 'setup' && setupData && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Scan this QR code with your authenticator app
                  </h3>
                  <div className="inline-block p-4 bg-white border-2 border-gray-300 rounded-lg">
                    <img src={setupData.qrCodeImage} alt="QR Code" className="w-48 h-48" />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Can not scan the QR code?
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Enter this code manually in your authenticator app:
                  </p>
                  <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm break-all">
                    {/* {setupData} */}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Recommended Apps:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Google Authenticator</li>
                    <li>• Microsoft Authenticator</li>
                    <li>• Authy</li>
                    <li>• 1Password</li>
                  </ul>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 'verify' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Enter the verification code
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter the 6-digit code from your authenticator app to complete setup.
                  </p>

                  <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="verification-code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="123456"
                    maxLength={6}
                  />
                </div>

                <button
                  onClick={handleVerify}
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify and Enable'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupTotpPage;