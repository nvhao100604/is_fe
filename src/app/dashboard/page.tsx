import { SecurityDashboard } from "@/components/dashboard/dashboard.components"
import ProtectedProvider from "@/components/providers/ProtectedProvider"
import { cookies } from "next/headers"

const DashBoardIndex = async () => {
    // const tokens = await cookies()
    // const token = tokens.get("refreshToken")?.value
    // console.log(token)
    return (
        <ProtectedProvider>
            <SecurityDashboard />
        </ProtectedProvider>
    )
}

export default DashBoardIndex