'use client'
import { tokenStorage } from "@/config/axios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getCurrentUser, getMFASettings, login, logout, refreshAccessToken, setLoadedUser, updateMFASettings } from "@/redux/slices/authSlices";
import { TOASTIFY_ERROR, TOASTIFY_SUCCESS, useToastify } from "@/store/Toastify";
import { LoginRequestDTO } from "@/types/request/auth.request.dto";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useAuth = () => useAppSelector(state => state.auth)

const useAuthAccount = () => {
    const auth = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()
    const accessToken = tokenStorage.getToken()
    const [token, setToken] = useState(accessToken)

    useEffect(() => {
        const refreshStoredToken = async () => {
            tokenStorage.clearToken()
            const newToken = await tokenStorage.refreshToken();
            setToken(newToken);
        }
        if (!auth.isAuthenticated) return;

        if (!token && auth.isAuthenticated) {
            refreshStoredToken()
        }

        if (auth.isAuthenticated && !auth.hasLoadedUser && accessToken) {
            dispatch(getCurrentUser())
        }
    }, [auth.isAuthenticated, auth.hasLoadedUser, token])

    return auth
}

const useLogin = () => {
    const auth = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()
    const toastify = useToastify()
    const router = useRouter()

    const logIn = async (userData: LoginRequestDTO) => dispatch(login(userData))

    useEffect(() => {
        const getUserData = async () => {
            if (auth.errors) {
                toastify.notify("Authentication Error", TOASTIFY_ERROR)
            }

            if (auth.isAuthenticated) {
                // dispatch(getCurrentUser())
                toastify.notify("Authentication Successfully!", TOASTIFY_SUCCESS)
                await new Promise(resolve => setTimeout(resolve, 2000))
                console.log("check promise")
                router.replace('/dashboard')
            }
        }
        getUserData()
    }, [auth.isAuthenticated])

    return logIn
}

const useLogout = () => {
    const dispatch = useAppDispatch()

    const logOut = () => dispatch(logout())
    return logOut
}

const useGetMFASettings = (option?: object) => {
    const auth = useAppSelector(state => state.auth)

    const dispatch = useAppDispatch()
    useEffect(() => {
        if (auth.account.accountId && !auth.mfaSettings) {
            dispatch(getMFASettings({ option }))
            console.log("Fetching MFA Settings...")
        }
    }, [auth.account])

    return { mfaSettings: auth.mfaSettings, isLoading: auth.isLoading, errors: auth.errors }
}

const useMFASettings = () => useAppSelector(state => state.auth.mfaSettings)

const useUpdateMFASettings = () => {
    const dispatch = useAppDispatch()
    const toastify = useToastify()

    const updateMFA = async ({ mfaId, data, option }: { mfaId: number, data: object, option?: object }) => {
        dispatch(updateMFASettings({ mfaId, data, option }))
        toastify.notify("Updating MFA Settings successfully!", TOASTIFY_SUCCESS)
    }
    return updateMFA
}

export {
    useAuth,
    useAuthAccount,
    useMFASettings,
    useLogin,
    useLogout,
    useGetMFASettings,
    useUpdateMFASettings,
}