const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const BASE_ACCOUNT_URL = '/accounts';
const BASE_AUTH_URL = '/auth'
const BASE_TOKEN_URL = '/tokens'
const BASE_LOGIN_ATTEMPTS_URL = '/login-attempts'
const BASE_MFA_URL = '/mfa-settings'
const BASE_TRUST_DEVICE_URL = '/trust-devices'
const BASE_USER_URL = '/user'

export {
  API_BASE_URL,
  BASE_ACCOUNT_URL,
  BASE_AUTH_URL,
  BASE_TOKEN_URL,
  BASE_LOGIN_ATTEMPTS_URL,
  BASE_MFA_URL,
  BASE_TRUST_DEVICE_URL,
  BASE_USER_URL
}