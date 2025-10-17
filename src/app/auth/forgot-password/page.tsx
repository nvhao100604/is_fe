import ForgotPasswordPage from '@/components/auth/ForgotPasswordControl';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: "Forgot Password | Information Security",
};

export default function ForgotPasswordPages() {
    return <ForgotPasswordPage />;
}