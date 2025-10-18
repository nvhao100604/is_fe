'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { SocialAuthButtons } from './SocialAuthButtons';
import { validatePassword } from '../../utils/validation.util';
import { LoginRequestDTO } from '../../types/request/auth.request.dto';
import { useAuth, useLogin } from '@/hooks/auth/auth.hooks';
import { authServices } from '@/services/auth.service';
import { MfaVerification } from './MfaVerification';

export const LoginForm: React.FC = () => {
  const [showMfaVerification, setShowMfaVerification] = useState(false);
  const router = useRouter();
  const auth = useAuth()
  const login = useLogin()
  const [formData, setFormData] = useState<LoginRequestDTO>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginRequestDTO>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginRequestDTO]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginRequestDTO> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMfaVerificationSuccess = () => {
    login(formData)
  }

  const handleMfaVerificationCancel = () => {
    setShowMfaVerification(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    //login(formData)
    const result = await authServices.authLogIn(formData);
    console.log('Login result:', result);
    if (result.success) {
      if (result.data.mfaRequired) {
        console.log('require true')
        setShowMfaVerification(true)
      } else {
        login(formData)
      }
    }

    // if (result && result.mfaRequired) {
    //   router.push(result.url);
    // } else if (result) {
    //   router.push('/dashboard');
    // }
  };

  if (showMfaVerification) {
    return (
      <MfaVerification
        action="login"
        title="Verify login for new device"
        description={`Please verify your identity before login.`}
        onSuccess={handleMfaVerificationSuccess}
        onCancel={handleMfaVerificationCancel}
        username={formData.username}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            name="username"
            label="Username"
            autoComplete='username'
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
          />

          <Input
            type="password"
            name="password"
            label="Password"
            autoComplete='current-password'
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link href="/auth/other-verify" className="text-sm text-blue-600 hover:text-blue-800">
              Forgot password?
            </Link>
          </div>
          <Button type='submit' loading={auth.isLoading}>Sign In</Button>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <SocialAuthButtons mode="login" isLogin={true} />
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Do not have an account?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};