import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Log in | Information Security",
};

export default function LoginPage() {
    return <LoginForm />
}
