import React from 'react';
import { useRouter } from 'next/router';
import { OTPVerification } from '@/components/auth/OTPVerification';

export default function VerifyEmailPage() {
    const router = useRouter();
    const { email } = router.query;

    const handleResend = async () => {
        try {
            // Implement resend OTP logic here
            console.log('Resending OTP...');
        } catch (error) {
            console.error('Failed to resend OTP:', error);
        }
    };

    return (
        <OTPVerification
            email={typeof email === 'string' ? email : undefined}
            onResend={handleResend}
        />
    );
}