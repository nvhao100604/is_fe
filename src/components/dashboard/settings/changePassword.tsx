'use client'

import api from "@/config/axios";
import { TOASTIFY_ERROR, TOASTIFY_SUCCESS, useToastify } from "@/store/Toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);
    const toast = useToastify()
    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            setIsLoading(false);
            return;
        }

        console.log("Current Password:", currentPassword);
        console.log("New Password:", newPassword);

        // Simulating API call
        try {
            // const response = await api.post("changepassword", {
            //     currentPassword,
            //     newPassword
            // })

            // if (response.success) {
            //     toast.notify("Password changed successfully!", TOASTIFY_SUCCESS)
            //     setCurrentPassword("");
            //     setNewPassword("");
            //     setConfirmPassword("");
            //     await new Promise(resolve => setTimeout(resolve, 1000))
            //     router.push('/dashboard/setting')
            // } else {
            //     toast.notify(response.message, TOASTIFY_ERROR)
            // }
        } catch (error) {
            setError("An error occurred while changing the password.")
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }

    };

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]+/)) strength++;
        if (password.match(/[A-Z]+/)) strength++;
        if (password.match(/[0-9]+/)) strength++;
        if (password.match(/[$@#&!]+/)) strength++;
        return strength;
    };

    const handleNewPasswordChange = (e: any) => {
        const value = e.target.value;
        setNewPassword(value);
        setPasswordStrength(calculatePasswordStrength(value));
    };
    return (
        <div className="flex items-center justify-center bg-cover bg-center">
            <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-2">Change Password</h1>
                <p className="text-gray-600 text-center mb-6">Welcome to the change password page.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                        <div className="mt-1 relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                id="currentPassword"
                                autoComplete="current-password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                                aria-label="Current Password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                            >
                                {showCurrentPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                        <div className="mt-1 relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                autoComplete="new-password"
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                                aria-label="New Password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                            >
                                {showNewPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" />}
                            </button>
                        </div>
                        <div className="mt-1 h-2 bg-gray-200 rounded-full">
                            <div
                                className={`h-full rounded-full ${passwordStrength <= 2 ? 'bg-red-500' : passwordStrength <= 4 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            ></div>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Password strength: {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 4 ? 'Medium' : 'Strong'}</p>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <div className="mt-1 relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                                aria-label="Confirm New Password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                            >
                                {showConfirmPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex items-center justify-between space-x-4">
                        <button
                            type="button"
                            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => window.history.back()}
                        >
                            <BiArrowBack className="mr-2" /> Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : (
                                "Change Password"
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">Password Change Instructions:</h2>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Enter your current password for verification.</li>
                        <li>Choose a new password that is at least 8 characters long.</li>
                        <li>Include a mix of uppercase and lowercase letters, numbers, and special characters for a strong password.</li>
                        <li>Confirm your new password by entering it again.</li>
                        <li>Click the "Change Password" button to update your password.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword