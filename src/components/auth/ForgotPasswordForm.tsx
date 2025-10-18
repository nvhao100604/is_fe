'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { validateEmail } from '../../utils/validation.util';
import { authServices } from '@/services/auth.service';
import { TOASTIFY_ERROR, TOASTIFY_SUCCESS, useToastify } from '@/store/Toastify';
import { accountServices } from '@/services/account.service';

// Thêm prop onSuccess để giao tiếp với component cha
interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const toastify = useToastify();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  const validateRequestForm = (): boolean => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRequestForm()) return;

    setLoading(true);
    try {
      // API call chỉ cần email
      const response: any = await accountServices.requireForgotPassword(email);

      console.log("Forgot password response:", response);
      if (response.success) {
        toastify.notify('A verification code has been sent to your email.', TOASTIFY_SUCCESS );
        // Gọi hàm onSuccess của cha và truyền email lên
        onSuccess(email);
      } else {
        setError(response.message || 'An error occurred.');
        toastify.notify(response.message || 'An error occurred.', TOASTIFY_ERROR );
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send reset code. Please try again.';
      setError(errorMessage);
      toastify.notify(errorMessage, TOASTIFY_ERROR );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
          <p className="text-gray-600">Enter your email to reset your password</p>
        </div>

        <form onSubmit={handleRequestSubmit} className="space-y-6">
          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={handleChange}
            error={error}
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Continue'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};