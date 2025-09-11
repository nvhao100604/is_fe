import { PageDTO } from "@/types/response/page.response.dto";
import { TrustDeviceDTO } from "@/types/response/trust_device.response.dto";
import { APIResponse } from "@/types/api";
import { TrustDeviceFilter } from "@/types/request/filters/TrustDeviceFilter";
import { BASE_TRUST_DEVICE_URL } from "../constants";
import { configRequest } from "@/config/api/config.api";

const BASE_URL = BASE_TRUST_DEVICE_URL;

class TrustDeviceService {
    async filter(filter: TrustDeviceFilter, page: number, size: number): Promise<APIResponse<PageDTO<TrustDeviceDTO>>> {
        const qs = new URLSearchParams();

        if (filter.deviceName) qs.set("deviceName", filter.deviceName);
        if (filter.deviceIsActive !== undefined) qs.set("deviceIsActive", String(filter.deviceIsActive));
        if (filter.deviceIsVerified !== undefined) qs.set("deviceIsVerified", String(filter.deviceIsVerified));
        if (filter.fromDate) qs.set("fromDate", filter.fromDate);
        if (filter.toDate) qs.set("toDate", filter.toDate);
        qs.set("page", String(page));
        qs.set("size", String(size));

        const response = await configRequest.makeRequest<APIResponse<PageDTO<TrustDeviceDTO>> | any>(
            `${BASE_URL}?${qs.toString()}`,
            { method: "GET" }
        );

        return response;
    }

    async activateDevice(deviceId: number): Promise<APIResponse<TrustDeviceDTO>> {
        const response = await configRequest.makeRequest<APIResponse<TrustDeviceDTO>>(
            `${BASE_URL}/${deviceId}/activate`,
            { method: "PUT" }
        );
        return response.data;
    }

    async deactivateDevice(deviceId: number): Promise<APIResponse<TrustDeviceDTO>> {
        const response = await configRequest.makeRequest<APIResponse<TrustDeviceDTO>>(
            `${BASE_URL}/${deviceId}/deactivate`,
            { method: "PUT" }
        );
        return response.data;
    }

    async verifyDevice(deviceId: number): Promise<APIResponse<TrustDeviceDTO>> {
        const response = await configRequest.makeRequest<APIResponse<TrustDeviceDTO>>(
            `${BASE_URL}/${deviceId}/verify`,
            { method: "PUT" }
        );
        return response.data;
    }

    async deleteDevice(deviceId: number): Promise<APIResponse<void>> {
        const response = await configRequest.makeRequest<APIResponse<void>>(
            `${BASE_URL}/${deviceId}`,
            { method: "DELETE" }
        );
        return response.data;
    }
}

export const trustDeviceService = new TrustDeviceService();
