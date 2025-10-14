import { API_BASE_URL, DEFAULT_TIMEOUT, NO_AUTH_ENDPOINTS, RESPONSE_DELAY } from "@/constants";
import { setAccessToken } from "@/redux/slices/authSlices";
import { store } from "@/redux/store";
import { tokenService } from "@/services/token.service";
import { clearAllKey } from "@/utils";
import axios from "axios";

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
        const token = store.getState().auth.accessTokens;
        console.log("token check: ", token)
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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    console.log("refresh token check: ", token)
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await tokenService.refreshToken();
                const newAccessToken = response.data.data.accessToken;
                console.log("refresh token check: ", newAccessToken)
                store.dispatch(setAccessToken(newAccessToken))
                api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
                processQueue(null, newAccessToken);

                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                console.error("Session expired. Please log in again.");
                clearAllKey();

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);



export default api