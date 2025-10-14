'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { totpService, TOTPVerificationDTO } from '@/services/totp.service';
import { TOASTIFY_ERROR, TOASTIFY_SUCCESS, useToastify } from '@/store/Toastify';

interface TOTPRegistrationDTO {
  secretKey: string;
  qrCodeUrl: string;
  qrCodeImage: string;
}

interface TOTPSetupProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TOTPSetup: React.FC<TOTPSetupProps> = ({ onSuccess, onCancel }) => {
    const toastify = useToastify()
  const router = useRouter();
  const [step, setStep] = useState<'loading' | 'setup' | 'verify'>('loading');
  const [setupData, setSetupData] = useState<TOTPRegistrationDTO | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);

  useEffect(() => {
     initializeTOTPSetup();
  }, []);

  const initializeTOTPSetup = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      // TODO: Call API to initialize TOTP setup
       const response = await totpService.registerToTp();
       console.log(response);
      if (response.success) {
        setSetupData(response.data);
        setStep('setup');
      } else {
        setErrorMessage(response.message);
      }

    } catch (err) {
      setErrorMessage('Failed to initialize TOTP setup');
    } finally{
      setIsLoading(false);
    }
  };

  const handleContinueToVerification = () => {
    setStep('verify');
    setErrorMessage(null);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) {
          (nextInput as HTMLInputElement).focus();
        }
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  };

  const handleVerifyTOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setErrorMessage('Please enter all 6 digits');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const otpVerify: TOTPVerificationDTO = { code: otpValue };

      // TODO: Call API to verify and enable TOTP
      const response = await totpService.verifyToTp(otpVerify);
      // 
      if (response.success) {
        toastify.notify('Verify is Successfully!', TOASTIFY_SUCCESS);
        onSuccess?.();
      } else {
        toastify.notify('Verify is Failed!', TOASTIFY_ERROR);
        setErrorMessage(response.message || 'Verification failed');
      }

      // Mock verification
      setTimeout(() => {
        setIsLoading(false);
        onSuccess?.();
      }, 1000);

    } catch (err) {
      setErrorMessage('Verification failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'verify') {
      setStep('setup');
      setOtp(['', '', '', '', '', '']);
      setErrorMessage(null);
    } else {
      cancelSetUp()
    }
  };

  const cancelSetUp = () =>{
      router.back()
    
  }



  const copySecretKey = async () => {
    if (setupData?.secretKey) {
      try {
        await navigator.clipboard.writeText(setupData.secretKey);
        // You might want to show a success message here
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = setupData.secretKey;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    }
  };

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Setting up TOTP</h2>
          <p className="text-gray-600">Please wait while we generate your QR code...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'setup' ? 'Set up Authenticator App' : 'Verify Setup'}
          </h1>
          <p className="text-gray-600">
            {step === 'setup' 
              ? 'Step 1 of 2: Scan the QR code with your authenticator app'
              : 'Step 2 of 2: Enter the verification code from your app'
            }
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
            <span className="text-sm">{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="ml-3 text-red-500 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Setup Step */}
        {step === 'setup' && setupData && (
          <div className="space-y-6">
            {/* QR Code */}
            <div className="text-center">
              <div className="inline-block p-4 bg-white border-2 border-gray-300 rounded-lg mb-4">
                <img 
                  src={setupData.qrCodeImage} 
                  alt="TOTP QR Code" 
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code with your authenticator app
              </p>
            </div>

            {/* Manual Entry Toggle */}
            <div className="text-center">
              <button
                onClick={() => setShowManualEntry(!showManualEntry)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Can't scan? Enter code manually
              </button>
            </div>

            {/* Manual Entry */}
            {showManualEntry && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Manual setup key:
                </h4>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 bg-white p-2 rounded border text-sm font-mono break-all">
                    {setupData.secretKey}
                  </code>
                  <button
                    onClick={copySecretKey}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex-shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            {/* Recommended Apps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Recommended Apps:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Google Authenticator</li>
                <li>• Microsoft Authenticator</li>
                <li>• Authy</li>
                <li>• 1Password</li>
              </ul>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinueToVerification}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              I've Added the Account
            </button>
          </div>
        )}

        {/* Verification Step */}
        {step === 'verify' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter the 6-digit code from your authenticator app
              </label>
              <div className="flex justify-center space-x-2 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleVerifyTOTP}
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify and Enable'
              )}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <button
              onClick={cancelSetUp}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Cancel setup
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Usage Example
const TOTPSetupExample: React.FC = () => {
  const router = useRouter();
  const [showSetup, setShowSetup] = useState(true);

  if (!showSetup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">TOTP Setup Demo</h2>
          <button
            onClick={() => setShowSetup(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Start TOTP Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <TOTPSetup
      onSuccess={() => {
        alert('TOTP setup completed successfully!');
        setShowSetup(false);
        // In real app: router.push('/dashboard') or redirect to settings
      }}
      onCancel={() => {
        setShowSetup(false);
        // In real app: router.back() or redirect to settings
      }}
    />
  );
};

export default TOTPSetupExample;