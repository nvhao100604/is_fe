import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mfaSettingServices } from '@/services/mfa-setting.service';

const BackupCodesPage: React.FC = () => {
  const router = useRouter();
  const [codes, setCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const loadBackupCodes = async () => {
      // try {
      //    setLoading(true);
      //   const response = await mfaSettingServices.getBackupCodes();
      //   if (response.success) {
      //     setCodes(response.data);
      //   } else {
      //     setError(response.message);
      //   } 
      // } catch (err) {
      //   setError('Failed to load backup codes');
      // } finally {
      //   setLoading(false);
      // }
    };
    loadBackupCodes();
  }, []);

  const handleRegenerate = async () => {
    if (!confirm('Are you sure? This will invalidate all existing backup codes.')) {
      return;
    }

    try {
      /* setRegenerating(true);
      const response = await mfaSettingService.regenerateBackupCodes();
      if (response.success) {
        setCodes(response.data);
        setDownloaded(false);
      } else {
        setError(response.message);
      } */
    } catch (err) {
      setError('Failed to regenerate backup codes');
    } finally {
      setRegenerating(false);
    }
  };

  const handleDownload = () => {
    const content = codes.map(code => code).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codes.join('\n'));
      // TODO: Show toast notification
    } catch (err) {
      console.error('Failed to copy codes');
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <button
              onClick={handleBack}
              className="text-sm text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Backup Codes</h1>
            <p className="mt-1 text-sm text-gray-600">
              Use these codes if you lose access to your primary authentication method
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.081 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-amber-900">Important:</h4>
                    <ul className="text-sm text-amber-800 mt-2 space-y-1">
                      <li>• Each code can only be used once</li>
                      <li>• Store these codes in a safe place</li>
                      <li>• Do not share these codes with anyone</li>
                      <li>• Generate new codes if these are compromised</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Backup Codes</h3>
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {codes.map((code, index) => (
                      <div
                        key={index}
                        className="bg-white px-3 py-2 rounded border text-center font-mono text-sm"
                      >
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </button>

                <button
                  onClick={handleCopy}
                  className="flex-1 flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>

                <button
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {regenerating ? 'Regenerating...' : 'Regenerate'}
                </button>
              </div>

              {downloaded && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-green-900">Codes Downloaded</h4>
                      <p className="text-sm text-green-800">
                        Your backup codes have been saved. Store them in a secure location.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupCodesPage;