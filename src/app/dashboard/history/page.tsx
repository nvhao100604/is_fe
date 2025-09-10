import { NextPageWithLayout } from "@/components/auth/NextPageWithLayout";
import HistoryPage from "./history.page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "History | Information Security",
};

const History: NextPageWithLayout = () => {
    return (
        <HistoryPage />
    )
};
export default History