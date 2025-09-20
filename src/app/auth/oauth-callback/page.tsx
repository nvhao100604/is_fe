'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { GitHubOAuth } from '@/utils';
import { authServices } from '@/services/auth.service';
// import { authService } from '@/services/auth.service';

export default function OAuthCallbackPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(true);
    const [query, setQuery] = useState({});

    useEffect(() => {
        try {
            const searchParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(searchParams.entries());
            setQuery(params);
        } catch (e) {
            console.error("Error accessing URL search params:", e);
        }
    }, []);

    useEffect(() => {
        handleOAuthCallback();
    }, [query]);

    const handleOAuthCallback = async () => {
        try {
            // const { code, state, error: oauthError, provider } = query;
            const stateOriginal = localStorage.getItem('github_oauth_state');

            // if (oauthError) {
            //     throw new Error(`OAuth error: ${oauthError}`);
            // }

            // if (!code) {
            //   throw new Error('No authorization code received');
            // }

            // if (provider === 'github' || state) {
            //     console.log('IF.Handling GitHub callback with code:', code, 'and state:', state, 'and stateOriginal:', stateOriginal);
            //     await handleGitHubCallback(code as string, state as string);
            // } else {
            //     console.log('ELSE.Handling Google callback with code:', code);
            //     await handleGoogleCallback(code as string);
            // }
        } catch (err) {
            console.error('OAuth callback error:', err);
            setError(err instanceof Error ? err.message : 'Authentication failed');
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
        } finally {
            setProcessing(false);
        }
    };

    const handleGitHubCallback = async (code: string, state: string) => {
        const githubOAuth = new GitHubOAuth();

        if (!githubOAuth.validateState(state)) {
            throw new Error('Invalid state parameter');
        }

        try {
            // Try sign-in first
            const authResult = await authServices.authGithubSignIn(code)
            localStorage.setItem('accessToken', authResult.token);
            localStorage.setItem('refreshToken', authResult.refreshToken);
            document.cookie = `accessToken=${authResult.token}; Path=/; SameSite=Strict`;
            router.push('/dashboard');
        } catch (error) {
            console.error('GitHub sign-in failed, trying sign-up:', error);
            // If sign-in fails, try sign-up
            throw new Error('GitHub sign-in failed, attempting sign-up');
        }
    };

    const handleGoogleCallback = async (code: string) => {
        // Implement Google OAuth callback
        console.log('Handling Google callback with code:', code);
        // Similar logic to GitHub but for Google
    };

    if (processing) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center">
                <LoadingSpinner />
                <p className="mt-4 text-gray-600">Processing authentication...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex flex-col items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <p className="text-sm text-gray-500">Redirecting to login page...</p>
                </div>
            </div>
        );
    }

    return null;
};