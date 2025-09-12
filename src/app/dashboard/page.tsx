import { SecurityDashboard } from "@/components/dashboard/dashboard.components"
import ProtectedProvider from "@/components/providers/ProtectedProvider"

const DashBoardIndex = () => {
    return (
        <ProtectedProvider>
            <SecurityDashboard />
        </ProtectedProvider>
    )
}

export default DashBoardIndex