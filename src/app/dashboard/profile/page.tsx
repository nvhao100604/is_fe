import { Metadata } from "next";
import UserProfilePage from "./profile.page"

export const metadata: Metadata = {
    title: "User Profile | Information Security",
};

const Profile = () => {
    return (
        <UserProfilePage />
    )
}

export default Profile