'use client'
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OTPVerification } from '@/components/auth/OTPVerification';

export default function VerifyEmailPage() {
    const router = useRouter();
    const email = "";

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
            email={typeof email === 'string' ? email : ""}
            onResend={handleResend}
        />
    );
}