import { Metadata } from "next";
import ProtectedProvider from "@/components/providers/ProtectedProvider";
import LoginAttemptsDashboard from "@/components/dashboard/loginAttempts/LoginAttemptLayout";

export const metadata: Metadata = {
    title: "History | Information Security",
};

const History = () => {
    return (
        <ProtectedProvider>
            <LoginAttemptsDashboard />
        </ProtectedProvider>
    )
};
export default History