'use client'
import { ACCESS_TOKEN_KEY, IS_AUTHENTICATED, REFRESH_TOKEN_KEY, USER_KEY } from '@/constants/storage_keys';
import { authServices } from '@/services/auth.service'
import { LoginRequestDTO } from '@/types/request/auth.request.dto'
import { UserDTO } from '@/types/response/user.response.dto';
import { clearAllKey, getItemWithKey, setItemWithKey } from '@/utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AuthTokens {
    token: string;
    refreshToken: string;
}

export interface AuthState {
    user: UserDTO | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    errors: any
}

const initialState: AuthState = {
    user: getItemWithKey(USER_KEY),
    tokens: null,
    isAuthenticated: getItemWithKey(IS_AUTHENTICATED),
    isLoading: false,
    errors: null
}

const login = createAsyncThunk(
    'user/login',
    async (userData: LoginRequestDTO, { rejectWithValue }) => {
        try {
            const response = await authServices.authLogIn(userData)
            if (response.success) {
                // console.log(response.data);
                clearAllKey()
                setItemWithKey(IS_AUTHENTICATED, true)
                setItemWithKey(ACCESS_TOKEN_KEY, response.data.token)
                setItemWithKey(REFRESH_TOKEN_KEY, response.data.refreshToken)
            }
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
)

const getCurrentUser = createAsyncThunk(
    'user/currentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authServices.getCurrentUser()
            // console.log("check response: ", response)
            if (response.success) {
                setItemWithKey("user_data", response.data)
                return response.data
            }
            else return response.message
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.isAuthenticated = false
            state.errors = null
            state.isLoading = false
            state.tokens = null
            clearAllKey()
        },
        incrementByAmount: (state, action: PayloadAction<number>) => {
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCurrentUser.pending, (state) => {
                state.isLoading = true
                state.errors = null
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload
                state.isLoading = false
                state.errors = null
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.user = null
                state.isLoading = false
                state.errors = action.payload
            })
            .addCase(login.pending, (state) => {
                state.isAuthenticated = false
                state.isLoading = true
                state.errors = null
            })
            .addCase(login.fulfilled, (state) => {
                state.isAuthenticated = true
                state.errors = null
            })
            .addCase(login.rejected, (state, action: PayloadAction<any>) => {
                state.errors = action.payload
                state.isAuthenticated = false
                state.isLoading = false
            })
    }
})

// Action creators are generated for each case reducer function
export { login, getCurrentUser, }
export const { logout, incrementByAmount } = authSlice.actions
export default authSlice.reducer