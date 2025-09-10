import { Metadata } from "next";
import DevicePage from "./device.page";
import { NextPageWithLayout } from "@/components/auth/NextPageWithLayout";

export const metadata: Metadata = {
    title: "Device | Information Security",
};

const Device: NextPageWithLayout = () => {
    return (
        <DevicePage />
    )
};

export default Device;
