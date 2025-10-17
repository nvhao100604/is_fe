'use client'
import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { authServices } from '@/services/auth.service';
import { TOASTIFY_ERROR, TOASTIFY_SUCCESS, useToastify } from '@/store/Toastify';
import { accountServices, FormResetPasswordDTO } from '@/services/account.service';

interface ChangePasswordFormProps {
  email: string;
  onSuccess: () => void;
  // verificationToken?: string; // Có thể bạn cần token này từ bước MFA
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ email, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const toastify = useToastify();

  const validate = () => {
    const newErrors: any = {};
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
        const data: FormResetPasswordDTO = {
            email: email,
            password: newPassword
        };
      // TODO: API CALL - Gọi API để reset mật khẩu
      const response = await accountServices.resetPassword(data);

      if (response.success) {
        toastify.notify('Password has been reset successfully!',TOASTIFY_SUCCESS );
        onSuccess();
      } else {
        toastify.notify(response.message || 'Failed to reset password.',TOASTIFY_ERROR );
      }
    } catch (err: any) {
      toastify.notify(err.message || 'An unexpected error occurred.',TOASTIFY_ERROR );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Set New Password</h1>
          <p className="text-gray-600">
            Create a new password for your account: <span className="font-medium">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="password"
            label="New Password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
            required
          />
          <Input
            type="password"
            label="Confirm New Password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Set New Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};