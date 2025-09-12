'use client'
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useAuth } from '@/hooks/auth/auth.hooks';
import { AccountResponseDTO, tempAccount } from '@/types/response/auth.response.dto';

const ProtectedContext = createContext<AccountResponseDTO>(tempAccount)

const useAccount = () => useContext(ProtectedContext)

const ProtectedProvider = ({ children }: { children: ReactNode }) => {
    const { account, isLoading } = useAuth()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const delay = async () => {
        await new Promise(resolve => setTimeout(resolve, 2000))
    }
    if (isLoading) {
        delay()
        return <LoadingSpinner />
    }

    if (!account && isMounted) {
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
        <ProtectedContext.Provider value={account}>
            {children}
        </ProtectedContext.Provider>
    )
}

export { useAccount }
export default ProtectedProvider