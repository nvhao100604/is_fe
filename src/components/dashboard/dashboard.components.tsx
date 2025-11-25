'use client'
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { BsShieldFillCheck, BsShieldFillX } from "react-icons/bs";
import { FiBarChart2, FiDownload, FiRefreshCw, FiSearch, FiSettings } from "react-icons/fi";
import { Chart as ChartJS, ChartData, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js/auto";
import { useAuth, useLogout } from "@/hooks/auth/auth.hooks";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const TopNav = ({
    setSidebarOpen
}: { setSidebarOpen: () => void }) => {
    const auth = useAuth()
    const logout = useLogout()
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleLogout = () => {
        logout();
        router.push('/auth/login')
    };

    return (
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4">
                <button
                    onClick={setSidebarOpen}
                    className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <div className="flex items-center space-x-4 w-full justify-between">
                    <div className="relative">
                        <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-2">
                                {auth.isAuthenticated && isMounted ?
                                    auth.account?.user?.userName?.charAt(0).toUpperCase()
                                    :
                                    "U"}
                            </div>
                            <span className="hidden md:block">{auth.isAuthenticated && isMounted && auth.account?.user?.userName}</span>
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>

                    {(auth.isAuthenticated && isMounted) ?
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-white hover:bg-red-800 bg-red-600 rounded-lg transition-colors"
                        >
                            Log out
                        </button>
                        :
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-white hover:bg-green-800 bg-green-600 rounded-lg transition-colors"
                        >
                            Log in
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}

type NavigationItem = {
    name: string, href: string, icon: string
}

interface SideBarProps {
    sidebarOpen: boolean,
    navigation: NavigationItem[],
    setSidebarOpen: () => void
}

const SideBar = ({
    sidebarOpen,
    navigation,
    setSidebarOpen,
}: SideBarProps) => {
    const pathname = usePathname();
    return (
        <>
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="fixed inset-0 bg-gray-600/50" onClick={setSidebarOpen} />
                </div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex items-center justify-center h-16 bg-blue-600">
                    <h1 className="text-white text-xl font-bold">My App</h1>
                </div>

                <nav className="mt-8">
                    <div className="px-4 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${pathname === item.href
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                <span className="mr-3">
                                    {item.icon === 'home' && (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                    )}
                                    {item.icon === 'user' && (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    )}
                                    {item.icon === 'settings' && (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                    {item.icon === 'devices' && (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9.75 17h4.5m-7.5 4.5h10.5A2.25 2.25 0 0021 19.25V4.75A2.25 2.25 0 0018.75 2.5H5.25A2.25 2.25 0 003 4.75v14.5A2.25 2.25 0 005.25 21.5h1.5z"
                                            />
                                        </svg>
                                    )}
                                    {item.icon === 'history' && (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    )}
                                </span>
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </nav>
            </div>
        </>
    )
}

interface SecurityMetrics {
    activeThreats: number;
    blockedAttempts: number;
    ongoingScans: number;
    complianceScore: number;
}

interface Incident {
    id: number;
    type: string;
    severity: "High" | "Critical" | "Medium";
    timestamp: string;
}

interface ChartDataset {
    label?: string;
    data: number[];
    fill?: boolean;
    borderColor?: string;
    backgroundColor: string | string[];
}

interface ChartDataType {
    labels: string[];
    datasets: ChartDataset[];
}

const SecurityDashboard = () => {
    const securityMetrics: SecurityMetrics = {
        activeThreats: 12,
        blockedAttempts: 2453,
        ongoingScans: 3,
        complianceScore: 87
    };

    const recentIncidents: Incident[] = [
        { id: 1, type: "Unauthorized Access", severity: "High", timestamp: "2024-01-20 14:30" },
        { id: 2, type: "Malware Detected", severity: "Critical", timestamp: "2024-01-20 13:15" },
        { id: 3, type: "Failed Login Attempts", severity: "Medium", timestamp: "2024-01-20 12:45" }
    ];

    const networkData: ChartData<"line"> = {
        labels: ["12:00", "13:00", "14:00", "15:00", "16:00"],
        datasets: [{
            label: "Network Traffic",
            data: [65, 59, 80, 81, 56],
            fill: true,
            borderColor: "#60A5FA",
            backgroundColor: "rgba(96, 165, 250, 0.1)"
        }]
    };

    const complianceData: ChartData<"doughnut"> = {
        labels: ["Compliant", "Non-Compliant"],
        datasets: [{
            data: [87, 13],
            backgroundColor: ["#34D399", "#FB7185"]
        }]
    };

    return (
        <div className={`min-h-screen text-gray-800`}>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Security Dashboard</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-red-500 rounded-lg p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-75">Active Threats</p>
                                <h2 className="text-2xl font-bold">{securityMetrics.activeThreats}</h2>
                            </div>
                            <BsShieldFillX className="text-3xl" />
                        </div>
                    </div>

                    <div className="bg-green-500 rounded-lg p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-75">Blocked Attempts</p>
                                <h2 className="text-2xl font-bold">{securityMetrics.blockedAttempts}</h2>
                            </div>
                            <BsShieldFillCheck className="text-3xl" />
                        </div>
                    </div>

                    <div className="bg-yellow-500 rounded-lg p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-75">Ongoing Scans</p>
                                <h2 className="text-2xl font-bold">{securityMetrics.ongoingScans}</h2>
                            </div>
                            <FiRefreshCw className="text-3xl" />
                        </div>
                    </div>

                    <div className="bg-blue-500 rounded-lg p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-75">Compliance Score</p>
                                <h2 className="text-2xl font-bold">{securityMetrics.complianceScore}%</h2>
                            </div>
                            <FiBarChart2 className="text-3xl" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className={"bg-white rounded-lg p-6 shadow-lg"}>
                        <h3 className="text-xl font-bold mb-4">Network Traffic</h3>
                        <Line data={networkData} options={{ responsive: true }} />
                    </div>

                    <div className={"bg-white rounded-lg p-6 shadow-lg"}>
                        <h3 className="text-xl font-bold mb-4">Compliance Overview</h3>
                        <Doughnut data={complianceData} options={{ responsive: true }} />
                    </div>
                </div>

                <div className={"bg-white rounded-lg p-6 shadow-lg mb-8"}>
                    <h3 className="text-xl font-bold mb-4">Recent Security Incidents</h3>
                    <div className="space-y-4">
                        {recentIncidents.map(incident => (
                            <div key={incident.id} className="flex items-center justify-between p-4 rounded-lg bg-opacity-10 bg-gray-700">
                                <div>
                                    <p className="font-medium">{incident.type}</p>
                                    <p className="text-sm opacity-75">{incident.timestamp}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm ${incident.severity === "Critical" ? "bg-red-500" :
                                    incident.severity === "High" ? "bg-yellow-500" : "bg-blue-500"
                                    }`}>
                                    {incident.severity}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="flex items-center justify-center gap-2 p-4 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">
                        <FiSearch className="text-xl" /> Start Scan
                    </button>
                    <button className="flex items-center justify-center gap-2 p-4 rounded-lg bg-green-600 hover:bg-green-700 transition-colors">
                        <FiDownload className="text-xl" /> Generate Report
                    </button>
                    <button className="flex items-center justify-center gap-2 p-4 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition-colors">
                        <FiBarChart2 className="text-xl" /> View Analytics
                    </button>
                    <button className="flex items-center justify-center gap-2 p-4 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors">
                        <FiSettings className="text-xl" /> Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export { TopNav, SideBar, SecurityDashboard }