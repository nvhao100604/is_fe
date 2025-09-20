'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SetupEmailPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<'enable' | 'verify'>('enable');
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnable = async () => {
    try {
      /* setLoading(true);
      setError(null);
      
      const response = await mfaSettingService.enableEmailMfa();
      
      if (response.success) {
        setStep('verify');
      } else {
        setError(response.message);
      } */
    } catch (err) {
      setError('Failed to enable email MFA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      /* setLoading(true);
      setError(null);
      
      const response = await mfaSettingService.verifyEmailForMfa({
        email,
        code: verificationCode
      });

      if (response.success) {
        router.push('/settings/mfa?success=email-enabled');
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
      setStep('enable');
    } else {
      router.back();
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Set up Email Authentication</h1>
            <p className="mt-1 text-sm text-gray-600">
              {step === 'enable' ? 'Enable email-based two-factor authentication' : 'Verify your email address'}
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {step === 'enable' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Email Authentication
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    When enabled, you will receive verification codes via email whenever you sign in or perform sensitive actions.
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-900">Note:</h4>
                        <p className="text-sm text-blue-800">
                          Make sure you have access to your email account before enabling this feature.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="your-email@example.com"
                    />
                  </div>
                </div>

                <button
                  onClick={handleEnable}
                  disabled={loading || !email}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </button>
              </div>
            )}

            {step === 'verify' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Verify Your Email
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    We have sent a verification code to your email address. Enter it below to complete setup.
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

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleEnable()}
                    className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Resend Code
                  </button>
                  <button
                    onClick={handleVerify}
                    disabled={loading || verificationCode.length !== 6}
                    className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Verifying...' : 'Verify and Enable'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupEmailPage;