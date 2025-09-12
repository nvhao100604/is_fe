import { Metadata } from "next";
import ProtectedProvider from "@/components/providers/ProtectedProvider";
import MfaSettingsPage from "@/components/dashboard";

export const metadata: Metadata = {
    title: "Setting | Information Security",
};

const Setting = () => {
    return (
        <ProtectedProvider>
            <MfaSettingsPage />
        </ProtectedProvider>
    )
}

export default Setting