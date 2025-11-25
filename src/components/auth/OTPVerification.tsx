'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../common/Button';
import { validateOTP } from '../../utils/validation.util';
import { EmailResendOTP, EmailVerification, mailServices } from '@/services/mail.services';
import { TOASTIFY_ERROR, TOASTIFY_INFO, TOASTIFY_SUCCESS, useToastify } from '@/store/Toastify';

interface OTPVerificationProps {
  email?: string;
  onResend?: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({ email, onResend }) => {
  const router = useRouter();
  // const { loading, error, execute } = useApi();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const toastify = useToastify()

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

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
    const email = localStorage.getItem("verify_email") ?? ''
    const verifyForm = { email: email, otp: otp.toString().replace(/,/g, "") }
    const response = await mailServices.verifySignUp(verifyForm)
    console.log("OTP Verification Response: ", response)
    if (response.success) {
      if (response.data.success) {
        toastify.notify("Email verified successfully", TOASTIFY_SUCCESS)
        localStorage.removeItem("verify_email")
        router.push('/auth/login?message=Email verified successfully');
      } else {
        toastify.notify(response.data.message || "Verification failed. Please try again.", TOASTIFY_ERROR)
      }
    } else {
      toastify.notify("Verification Error", TOASTIFY_ERROR)
    }
  };

  const handleResend = async () => {
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    const emailLocal = localStorage.getItem("verify_email") ?? ''
    const email: EmailResendOTP = { email: emailLocal }
    const response = await mailServices.sendVerificationEmail(email)
    if (response.success) {
      toastify.notify("OTP sent successfully", TOASTIFY_INFO)
    } else {
      toastify.notify("Resend OTP Error. Please try again later.", TOASTIFY_ERROR)
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We have sent a verification code to
            {email && <><br /><span className="font-semibold">{email}</span></>}
          </p>
        </div>

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
            Verify Email
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            {canResend ? (
              "Didn't receive the code?"
            ) : (
              `Resend code in ${formatTime(timeLeft)}`
            )}
          </p>
          <button
            onClick={handleResend}
            disabled={!canResend}
            className={`text-sm font-medium ${canResend
              ? 'text-blue-600 hover:text-blue-800 cursor-pointer'
              : 'text-gray-400 cursor-not-allowed'
              }`}
          >
            Resend verification code
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Wrong email address?{' '}
            <button
              onClick={() => {
                localStorage.removeItem("verify_email");
                router.back()
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Go back
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};