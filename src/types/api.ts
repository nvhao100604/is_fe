export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[] | null;
  path: string;
}

export interface Query {
  [key: string]: number | boolean | string | Date | undefined | null,
  page: number,
  size: number
}

export const defaultQuery: Query = {
  page: 0,
  size: 10
}

export interface TrustDeviceQuery extends Query {
  accountId: number | null,
  deviceName: string | null,
  deviceIsActive: boolean | null,
  deviceIsVerified: boolean | null,
  fromDate: Date | string,
  toDate: Date | string,
}

export const tempTrustDevice: TrustDeviceQuery = {
  accountId: 0,
  deviceName: null,
  deviceIsActive: true,
  deviceIsVerified: false,
  fromDate: "",
  toDate: "",
  page: 0,
  size: 10
}

export interface LoginAttemptQuery extends Query {
  attemptSuccess?: boolean | null,
  startDate?: string,
  endDate?: string,
}

export const tempLoginAttempts: LoginAttemptQuery = {
  attemptSuccess: null,
  startDate: "",
  endDate: "",
  page: 0,
  size: 10
}
