import { API_BASE_URL, DEFAULT_TIMEOUT, NO_AUTH_ENDPOINTS, RESPONSE_DELAY } from "@/constants";
import { logout } from "@/redux/slices/authSlices";
import { authServices } from "@/services/auth.service";
import { tokenService } from "@/services/token.service";
import { clearAllKey } from "@/utils";
import axios from "axios";

let storeDispatch: any = null;
let storeGetState: any = null;
let accessToken: string | null = null;

const setupInterceptors = (dispatch: any, getState: any) => {
    storeDispatch = dispatch;
    storeGetState = getState;
};

export const tokenStorage = {
    setToken: (token: string | null) => {
        accessToken = token;
    },
    getToken: () => accessToken,
    clearToken: () => {
        accessToken = null;
    },
    refreshToken: async (): Promise<string | null> => {
        try {
            const response = await tokenService.refreshToken();
            console.log("Token refreshed in storage: ", response);
            if (response?.data?.token) {
                const newToken = response.data.token;
                tokenStorage.setToken(newToken);
                console.log("Auth restored on reload");
                return newToken;
            }
        } catch (error) {
            console.log("No valid session on reload");
        }
        return null
    }
}

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: DEFAULT_TIMEOUT,
})

api.interceptors.request.use(config => {
    const requiresAuth = !NO_AUTH_ENDPOINTS.some(endpoint => config.url?.includes(endpoint));

    if (requiresAuth) {
        // const token = storeGetState().auth.accessTokens;
        const token = tokenStorage.getToken();
        console.log("Attaching token to request: ", token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    console.log(`API request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
},
    error => {
        console.error(`Request error: ${error}`)
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Hàm xử lý logout khi token hết hạn
const handleTokenExpired = async () => {
    try {
        // Gọi API logout nếu có
        const token = tokenStorage.getToken();
        if (token) {
            try {
                const response = await authServices.authLogout();
                console.log("Logged out successfully:", response);
            } catch (error) {
                console.error("Error during logout API call:", error);
            }
        }
    } catch (error) {
        console.error('Error during logout:', error);
    } finally {
        clearAllKey();
        if (storeDispatch) {
            storeDispatch(logout());
        }

        // Redirect về trang login (nếu cần)
        // window.location.href = '/login';
    }
};

const handleRefreshToken = async (originalRequest: any): Promise<any> => {
    try {
        const response = await tokenService.refreshToken();

        if (!response?.data?.token) {
            console.error('Invalid refresh token response');
            throw new Error('Invalid refresh token response');
        }

        const newAccessToken = response.data.token;
        console.log('Token refreshed successfully: ', newAccessToken);
        tokenStorage.setToken(newAccessToken);

        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return api(originalRequest);

    } catch (error: any) {
        console.error('Token refresh failed:', error.message || error);
        processQueue(error, null);
        console.error("Session expired. Please log in again.");

        // Xử lý logout
        await handleTokenExpired();

        throw error;
    }
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (!error.response) {
            console.error('Network error:', error.message);
            return Promise.reject(error);
        }

        const isLogoutRequest = originalRequest?.url?.includes('/logout');
        const isRefreshRequest = originalRequest?.url?.includes('/refresh-token') ||
            originalRequest?.url?.includes('/refresh');

        if (
            error.response.status === 401 &&
            !originalRequest._retry &&
            !isLogoutRequest &&
            !isRefreshRequest
        ) {
            if (isRefreshing) {
                console.log('⏳ Token refresh in progress, queueing request...');
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                return await handleRefreshToken(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export { setupInterceptors }
export default api;