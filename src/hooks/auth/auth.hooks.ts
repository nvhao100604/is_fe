'use client'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getCurrentUser, login, logout } from "@/redux/slices/authSlices";
import { TOASTIFY_ERROR, TOASTIFY_SUCCESS, useToastify } from "@/store/Toastify";
import { LoginRequestDTO } from "@/types/request/auth.request.dto";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useAuth = () => useAppSelector(state => state.auth)

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
                dispatch(getCurrentUser())
                toastify.notify("Authentication Successfully!", TOASTIFY_SUCCESS)
                await new Promise(resolve => setTimeout(resolve, 2000))
                router.push('/dashboard')
            }
        }
        getUserData()
    }, [auth.isAuthenticated, auth.errors])

    return logIn
}

const useLogout = () => {
    const dispatch = useAppDispatch()

    const logOut = () => dispatch(logout())
    return logOut
}

export {
    useAuth,
    useLogin,
    useLogout
}