'use client'
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { UserProfile } from "@/components/dashboard/UserProfile";
import { useAuth } from "@/hooks/useAuth";
import { NextPageWithLayout } from "@/components/auth/NextPageWithLayout";

const UserProfilePage: NextPageWithLayout = () => {
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
            <UserProfile user={user} />
        </div>
    );
};
export default UserProfilePage;
