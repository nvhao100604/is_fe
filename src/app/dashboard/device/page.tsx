import { Metadata } from "next";
import { NextPageWithLayout } from "@/components/auth/NextPageWithLayout";
import ProtectedProvider from "@/components/providers/ProtectedProvider";
import TrustDevicesDashboard from "@/components/dashboard/TrustDeviceLayout";

export const metadata: Metadata = {
    title: "Device | Information Security",
};

const Device: NextPageWithLayout = () => {
    return (
        <ProtectedProvider>
            <TrustDevicesDashboard />
        </ProtectedProvider>
    )
};

export default Device;
