'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../common/Button';
import { validateOTP } from '../../utils/validation.util';
import { mfaSettingServices } from '@/services/mfa-setting.service';

interface VerifyDeviceWithTOTP {
  username?: string;
  deviceId?: number;
  totpVerificationDTO: {
    code?: string;
  }
}

export const TOTPVerification = () => {
  const router = useRouter();
  // const { loading, error, execute } = useApi();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false)

  // const pendingAuth: any = sessionStorage.getItem("pendingAuth") || null;
  // const parsedPendingAuth = pendingAuth ? JSON.parse(pendingAuth) : null;

  const verification: VerifyDeviceWithTOTP = {
    // username: parsedPendingAuth?.username,
    // deviceId: parsedPendingAuth?.deviceId,
    totpVerificationDTO: {
      code: '',
    },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join('');
    if (!validateOTP(otpValue)) {
      return;
    }

    verification.totpVerificationDTO.code = otpValue;
    console.log('Verifying device with TOTP:', verification);

    const response = await mfaSettingServices.verifyTOTP(verification);
    if (response.mfaRequired) {
      setErrorMessage(response.message || 'Device verified failed');
    } else {
      setErrorMessage(null);
      localStorage.setItem('accessToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      document.cookie = `accessToken=${response.token}; Path=/; SameSite=Strict`;
      router.push('/dashboard');
    }

    /* if (success) {
      router.push('/auth/login?message=Device verified successfully');
    } */
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Device</h1>
          <p className="text-gray-600">
            This is your first login on a new device. Please check the TOTP authentication app on your phone to complete the verification process.<br />
            {verification.username && <><span className="font-semibold">{verification.username}</span></>}
          </p>
        </div>

        {/* {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )} */}

        {errorMessage && (
          <div className="mb-3 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg flex justify-between items-center">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="ml-3 text-sm text-red-500 hover:underline"
            >
              Close
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter 6-digit verification code
            </label>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
          </div>

          <Button type="submit" loading={isLoading} disabled={otp.join('').length !== 6}>
            Verify Device
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Wrong device?{' '}
            <button
              onClick={() => router.push("/auth/login")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              If you have other Account? Go Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};