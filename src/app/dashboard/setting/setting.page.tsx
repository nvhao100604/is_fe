'use client'
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import MfaSettingsPage from "@/components/dashboard";
import { useAuth } from "@/hooks/useAuth";

function SettingsPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600">Please log in to access the dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <MfaSettingsPage />
        </div>
    )
}

export default SettingsPage