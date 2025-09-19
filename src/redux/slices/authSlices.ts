'use client'
import { ACCESS_TOKEN_KEY, IS_AUTHENTICATED, MFA_SETTINGS_KEY, REFRESH_TOKEN_KEY, USER_KEY } from '@/constants/storage_keys';
import { accountServices } from '@/services/account.service';
import { authServices } from '@/services/auth.service'
import { mfaSettingServices } from '@/services/mfa-setting.service';
import { LoginRequestDTO } from '@/types/request/auth.request.dto'
import { AccountResponseDTO, tempAccount } from '@/types/response/auth.response.dto';
import { MFASettingResponseDTO } from '@/types/response/mfasetting.response.dto';
import { clearAllKey, getItemWithKey, setItemWithKey } from '@/utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AuthTokens {
    token: string;
    refreshToken: string;
}

export interface AuthState {
    account: AccountResponseDTO;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    errors: any,
    mfaSettings: MFASettingResponseDTO | null
}

const initialState: AuthState = {
    account: getItemWithKey(USER_KEY) || tempAccount,
    tokens: null,
    isAuthenticated: getItemWithKey(IS_AUTHENTICATED),
    isLoading: false,
    errors: null,
    mfaSettings: null
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
                document.cookie = `accessToken=${response.data.token}; Path=/; SameSite=Strict`
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
            const response = await accountServices.getAccounts()
            // console.log("check response: ", response)
            if (response.success) {
                setItemWithKey(USER_KEY, response.data)
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

const getMFASettings = createAsyncThunk(
    'user/mfaSettings',
    async ({ option }: { option?: object }, { rejectWithValue }) => {
        try {
            const response = await mfaSettingServices.getMFASetting(option)
            console.log("MFA Settings fetched: ", response.data)
            if (response.success) {
                setItemWithKey(MFA_SETTINGS_KEY, response.data)
                // await new Promise(resolve => setTimeout(resolve, 1500))
                return response.data
            } else return response.message
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    })

const updateMFASettings = createAsyncThunk(
    'user/updateMfaSettings',
    async ({ mfaId, data, option }: { mfaId: number, data: object, option?: object }, { rejectWithValue }) => {
        try {
            const response = await mfaSettingServices.updateMFASetting(mfaId, data, option)
            if (response.success) {
                // console.log("MFA Settings updated: ", response);
                return response.data
            } else return response.message
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    })

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.account = tempAccount
            state.isAuthenticated = false
            state.errors = null
            state.isLoading = false
            state.tokens = null
            clearAllKey()
            document.cookie = 'accessToken=; Path=/; Max-Age=0';
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
                state.account = action.payload
                state.isLoading = false
                state.errors = null
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.account = tempAccount
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
            .addCase(getMFASettings.pending, (state) => {
                state.isLoading = true
                state.errors = null
                state.mfaSettings = null
            })
            .addCase(getMFASettings.fulfilled, (state, action: PayloadAction<MFASettingResponseDTO>) => {
                state.mfaSettings = action.payload
                state.isLoading = false
                state.errors = null
            })
            .addCase(getMFASettings.rejected, (state, action) => {
                state.mfaSettings = null
                state.isLoading = false
                state.errors = action.payload
            })
            .addCase(updateMFASettings.pending, (state) => {
                state.errors = null
            })
            .addCase(updateMFASettings.fulfilled, (state, action: PayloadAction<MFASettingResponseDTO>) => {
                state.mfaSettings = action.payload
                state.errors = null
            })
            .addCase(updateMFASettings.rejected, (state, action) => {
                state.errors = action.payload
            })
    }
})

// Action creators are generated for each case reducer function
export { login, getCurrentUser, getMFASettings, updateMFASettings, }
export const { logout, incrementByAmount } = authSlice.actions
export default authSlice.reducer