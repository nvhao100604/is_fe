'use client'
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useAuthAccount } from '@/hooks/auth/auth.hooks';
import { AccountResponseDTO, tempAccount } from '@/types/response/auth.response.dto';
import ExpiredModal from '../auth/ExpiredModal';

const ProtectedContext = createContext<AccountResponseDTO>(tempAccount)

const useAccount = () => useContext(ProtectedContext)

const ProtectedProvider = ({ children }: { children: ReactNode }) => {
    const auth = useAuthAccount()
    const [isSessionExpired, setIsSessionExpired] = useState(false);
    const wasAuthenticated = useRef(false);

    useEffect(() => {
        if (auth.isLoading) return;

        if (auth.isAuthenticated) {
            wasAuthenticated.current = true;
        }

        if (wasAuthenticated.current && !auth.isAuthenticated) {
            setIsSessionExpired(true);
        }

    }, [auth.isLoading, auth.isAuthenticated]);

    if (auth.isLoading) {
        return <LoadingSpinner />
    }

    if (isSessionExpired) {
        return (
            <>
                <ExpiredModal />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                        <p className="text-gray-600">Please log in to access the dashboard.</p>
                    </div>
                </div>
            </>
        )
    }

    if (!auth.isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600">Please log in to access the dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <ProtectedContext.Provider value={auth.account ?? tempAccount}>
                {children}
            </ProtectedContext.Provider>
        </>
    )
}

export { useAccount }
export default ProtectedProvider