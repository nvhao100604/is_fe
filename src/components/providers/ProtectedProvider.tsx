'use client'
import { createContext, ReactNode, useContext } from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useAuthAccount } from '@/hooks/auth/auth.hooks';
import { AccountResponseDTO, tempAccount } from '@/types/response/auth.response.dto';

const ProtectedContext = createContext<AccountResponseDTO>(tempAccount)

const useAccount = () => useContext(ProtectedContext)

const ProtectedProvider = ({ children }: { children: ReactNode }) => {
    const auth = useAuthAccount()

    if (auth.isLoading && typeof window !== 'undefined') {
        return <LoadingSpinner />
    }

    if (!auth.isAuthenticated && typeof window !== 'undefined') {
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
            {auth.account &&
                <ProtectedContext.Provider value={auth.account}>
                    {children}
                </ProtectedContext.Provider>
            }
        </>
    )
}

export { useAccount }
export default ProtectedProvider