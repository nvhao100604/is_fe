import { Metadata } from "next";
import SettingsPage from "./setting.page"

export const metadata: Metadata = {
    title: "Setting | Information Security",
};

const Setting = () => {
    return (
        <SettingsPage />
    )
}

export default Setting