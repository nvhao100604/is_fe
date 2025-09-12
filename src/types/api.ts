export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[] | null;
  path: string;
}

export interface Query {
  [key: string]: number | boolean | string | Date | undefined,
  page: number,
  size: number
}

export const defaultQuery: Query = {
  page: 0,
  size: 10
}

export interface TrustDeviceQuery extends Query {
  accountId?: number,
  deviceName?: string,
  deviceIsActive?: boolean,
  deviceIsVerified?: boolean,
  fromDate?: Date,
  toDate?: Date,
}

export interface LoginAttemptQuery extends Query {
  attemptSuccess?: boolean,
  startDate?: string,
  endDate?: string,
}