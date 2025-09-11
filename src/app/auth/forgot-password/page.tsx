import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: "Forgot Password | Information Security",
};

export default function ForgotPasswordPage() {
    return <ForgotPasswordForm />;
}