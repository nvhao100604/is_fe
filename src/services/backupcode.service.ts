import api from "@/config/axios"

const BASE_URL = '/backup-codes';
const BASE_NA_URL = '/na-backup-codes';

export interface BackupCodeVerificationAuth{
    email: string;
    code: string;
}

const getBackupCodes = async (): Promise<any> => {
    const response = await api.get(`${BASE_URL}`);
    return response.data;
}

const generateBackupCodes = async (): Promise<any> => {
    const response = await api.post(`${BASE_URL}/generate`);
    return response.data;
}

const verifyBackupCode = async (code: string): Promise<any> => {
    const response = await api.post(`${BASE_URL}/verify`, { code });
    return response.data;
}

const deleteBackupCodes = async (): Promise<any> => {
    const response = await api.delete(`${BASE_URL}`);
    return response.data;
}

const verifyCodeAuth = async (backupCode: BackupCodeVerificationAuth): Promise<any> => {
    const response = await api.post(`${BASE_NA_URL}/invalidate`, backupCode);
    return response.data;
}

export const backupCodeService = {
    getBackupCodes,
    generateBackupCodes,
    verifyBackupCode,
    deleteBackupCodes,
    verifyCodeAuth
}