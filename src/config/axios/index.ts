import { API_BASE_URL, DEFAULT_TIMEOUT, NO_AUTH_ENDPOINTS, RESPONSE_DELAY } from "@/constants";
import { ACCESS_TOKEN_KEY } from "@/constants/storage_keys";
import { tokenService } from "@/services/token.service";
import { clearAllKey, getItemWithKey, setItemWithKey } from "@/utils";
import axios from "axios";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: DEFAULT_TIMEOUT
})

api.interceptors.request.use(config => {

    const requiresAuth = !NO_AUTH_ENDPOINTS.some(endpoint => config.url?.includes(endpoint));

    if (requiresAuth) {
        const token = getItemWithKey(ACCESS_TOKEN_KEY);
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
    (response) => {
        // Bất kỳ status code nào trong khoảng 2xx sẽ vào đây
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Chỉ xử lý khi lỗi là 401 và request đó chưa được thử lại
        if (error.response?.status === 401 && !originalRequest._retry) {

            if (isRefreshing) {
                // Nếu đang có một tiến trình refresh token khác, đẩy request này vào hàng đợi
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest); // Thử lại request với token mới
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true; // Đánh dấu là đã thử lại
            isRefreshing = true;

            try {
                const response = await tokenService.refreshToken();
                const newAccessToken = response.data.data.accessToken;

                // Lưu token mới
                setItemWithKey(ACCESS_TOKEN_KEY, newAccessToken);

                // Cập nhật header mặc định cho các request sau
                api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
                
                // Thực thi lại các request trong hàng đợi với token mới
                processQueue(null, newAccessToken);

                // Thử lại request gốc
                return api(originalRequest);
            } catch (refreshError) {
                // Nếu refresh token thất bại, đăng xuất người dùng
                processQueue(refreshError, null);
                console.error("Session expired. Please log in again.");
                clearAllKey(); // Xóa tất cả token và thông tin user
                //window.location.href = '/auth/login'; // Chuyển hướng về trang đăng nhập

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Với các lỗi khác (không phải 401), trả về lỗi đó
        return Promise.reject(error);
    }
);



export default api