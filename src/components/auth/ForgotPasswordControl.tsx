'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'; // Cập nhật đường dẫn
import { MfaVerification } from '@/components/auth/MfaVerification'; // Cập nhật đường dẫn
import { ChangePasswordForm } from './ChangePasswordForm';

// Định nghĩa các bước của flow
type ForgotPasswordStep = 'request' | 'mfa' | 'change';

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<ForgotPasswordStep>('request');
  const [userEmail, setUserEmail] = useState<string>('');

  // 1. Khi người dùng nhập email và submit thành công
  const handleRequestSuccess = (email: string) => {
    setUserEmail(email); // Lưu lại email
    setStep('mfa');      // Chuyển sang bước MFA
  };

  // 2. Khi người dùng xác thực MFA thành công
  const handleMfaSuccess = () => {
    setStep('change'); // Chuyển sang bước đổi mật khẩu
  };

  // 3. Khi người dùng đổi mật khẩu thành công
  const handlePasswordChanged = () => {
    // Điều hướng về trang login với thông báo
    router.push('/auth/login?message=Password reset successful. Please sign in with your new password.');
  };

  // Hàm render component tương ứng với bước hiện tại
  const renderStep = () => {
    switch (step) {
      case 'request':
        return <ForgotPasswordForm onSuccess={handleRequestSuccess} />;
      
      case 'mfa':
        // Truyền email như username để MfaVerification có thể sử dụng
        return (
          <MfaVerification
            action="password_reset" // Action rất quan trọng
            username={userEmail}     // Dùng email để xác định user
            onSuccess={handleMfaSuccess}
            onCancel={() => setStep('request')} // Cho phép quay lại
          />
        );

      case 'change':
        return (
          <ChangePasswordForm
            email={userEmail}
            onSuccess={handlePasswordChanged}
          />
        );

      default:
        return <ForgotPasswordForm onSuccess={handleRequestSuccess} />;
    }
  };

  return (
    <div>
      {renderStep()}
    </div>
  );
};

export default ForgotPasswordPage;