'use client'
import React, { useState } from 'react';
import { SideBar, TopNav } from '@/components/dashboard/dashboard.components';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: 'home' },
        { name: 'Profile', href: '/dashboard/profile', icon: 'user' },
        { name: 'Device Manager', href: '/dashboard/device', icon: 'devices' },
        { name: 'History Login', href: '/dashboard/history', icon: 'history' },
        { name: 'Setting', href: '/dashboard/setting', icon: 'settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">

            <SideBar
                navigation={navigation}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={() => setSidebarOpen(false)}
            />
            {/* Main content */}
            <div className="flex-1 p-6">
                <TopNav setSidebarOpen={() => setSidebarOpen(true)} />

                {/* Page content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout