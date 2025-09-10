import { PageDTO } from "@/types/response/page.response.dto";
import { APIResponse } from "@/types/api";
import { LoginAttemptFilter } from "@/types/request/filters/LoginAttemptFilter";
import { BASE_LOGIN_ATTEMPTS_URL } from "../constants";
import { LoginAttemptDTO } from "@/types/response/login_attempt.response.dto";
import { configRequest } from "@/config/api/config.api";

const BASE_URL = BASE_LOGIN_ATTEMPTS_URL;

class LoginAttemptService {

  async getLoginAttempts(): Promise<APIResponse<PageDTO<LoginAttemptDTO>> | any> {
    const response = await configRequest.makeAuthenticatedRequest<APIResponse<PageDTO<LoginAttemptDTO>>>(
      `${BASE_URL}`,
      {
        method: 'GET',
      }
    );
    return response;
  }

  async filter(filter: LoginAttemptFilter, page: number, size: number): Promise<APIResponse<PageDTO<LoginAttemptDTO>> | any> {
    const qs = new URLSearchParams();
    if (filter.attemptSuccess !== undefined) qs.set("attemptSuccess", String(filter.attemptSuccess));
    if (filter.startDate) qs.set("startDate", filter.startDate);
    if (filter.endDate) qs.set("endDate", filter.endDate);
    qs.set("page", String(page));
    qs.set("size", String(size));
    const response = await configRequest.makeAuthenticatedRequest<APIResponse<PageDTO<LoginAttemptDTO>>>(
      `${BASE_URL}/filter?${qs.toString()}`,
      { method: "GET" }
    );

    return response;
  }

}

export const loginAttemptService = new LoginAttemptService();