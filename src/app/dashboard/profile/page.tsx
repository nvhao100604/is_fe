import { Metadata } from "next";
import ProtectedProvider from "@/components/providers/ProtectedProvider";
import { UserProfile } from "@/components/dashboard/UserProfile";

export const metadata: Metadata = {
    title: "User Profile | Information Security",
};

const Profile = () => {
    return (
        <ProtectedProvider>
            <UserProfile />
        </ProtectedProvider>
    )
}

export default Profile