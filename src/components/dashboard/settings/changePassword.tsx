import { TOASTIFY_ERROR, TOASTIFY_SUCCESS, useToastify } from "@/store/Toastify";
import { useState, useEffect, useRef } from "react";
import { FiMail } from "react-icons/fi";

const ChangePassword = () => {
    const timer = useRef<ReturnType<typeof setInterval>>(null)
    const [email] = useState("john.doe@example.com")
    const [maskedEmail, setMaskedEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [otpSent, setOtpSent] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const [loading, setLoading] = useState(false)
    const [showPasswordForm, setShowPasswordForm] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const toast = useToastify()

    useEffect(() => {
        const masked = maskEmail(email)
        setMaskedEmail(masked)
    }, [email])

    useEffect(() => {
        if (countdown > 0) {
            timer.current = setInterval(() => {
                setCountdown((prev) => prev - 1)
            }, 1000)
        } else {
            setOtpSent(false)
        }
        return () => clearInterval(timer.current!)
    }, [countdown])

    const maskEmail = (email: string) => {
        const [username, domain] = email.split("@")
        const maskedUsername = username.charAt(0) + "*".repeat(username.length - 2) + username.charAt(username.length - 1)
        return `${maskedUsername}@${domain}`
    };

    const handleOtpChange = (e: any) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 5) {
            setOtp(value)
        }
    };

    const handleGetOtp = async () => {
        setLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            setOtpSent(true)
            setCountdown(30)
            toast.notify("Gửi mã OTP thành công!", TOASTIFY_SUCCESS)
        } catch (error) {
            toast.notify("Gửi mã OTP thất bại. Vui lòng thử lại.", TOASTIFY_ERROR)
        } finally {
            setLoading(false)
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            if (otp === "12345") {
                toast.notify("Xác thực OTP thành công!", TOASTIFY_SUCCESS)
                setOtp("")
                setOtpSent(false)
                setCountdown(0)
                setShowPasswordForm(true)
            } else {
                toast.notify("Mã OTP không hợp lệ. Vui lòng thử lại.", TOASTIFY_ERROR)
            }
        } catch (error) {
            toast.notify("Xác thực thất bại. Vui lòng thử lại.", TOASTIFY_ERROR)
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e: any) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setErrorMessage("Mật khẩu xác nhận không khớp.")
            return;
        }
        if (newPassword.length < 8) {
            setErrorMessage("Mật khẩu mới phải có ít nhất 8 ký tự.")
            return
        }
        toast.notify("Đổi mật khẩu thành công!", TOASTIFY_SUCCESS)
        setErrorMessage("")
        setNewPassword("")
        setConfirmPassword("")
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-card rounded-lg shadow-sm p-8">
                <h1 className="text-heading font-heading text-center mb-8 text-foreground">Đổi mật khẩu</h1>

                {!showPasswordForm ? (
                    <div className="space-y-6">
                        <div className="bg-muted rounded-lg p-4 flex items-center gap-3">
                            <FiMail className="text-accent text-xl" />
                            <div>
                                <p className="text-sm text-accent-foreground">Email</p>
                                <p className="text-foreground font-medium">{maskedEmail}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="otp" className="block text-sm font-medium text-foreground">
                                Nhập OTP
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={handleOtpChange}
                                    placeholder="Enter 5-digit OTP"
                                    className="flex-1 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground bg-background"
                                    maxLength={5}
                                />
                                <button
                                    onClick={handleGetOtp}
                                    disabled={otpSent || loading}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${otpSent ? "bg-muted text-accent-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                                >
                                    {loading ? "Đang gửi..." : countdown > 0 ? `${countdown}s` : "Get OTP"}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleVerifyOtp}
                                disabled={otp.length !== 5 || loading}
                                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${otp.length !== 5 ? "bg-muted text-accent-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                            >
                                {loading ? "Đang xác thực..." : "Xác thực"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {errorMessage && (
                            <div className="text-destructive text-sm">{errorMessage}</div>
                        )}
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label htmlFor="new-password" className="block text-sm font-medium text-foreground">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    id="new-password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground bg-background"
                                    placeholder="Nhập mật khẩu mới"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground">Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground bg-background"
                                    placeholder="Nhập lại mật khẩu mới"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                Thay đổi
                            </button>
                        </form>

                        <div className="bg-muted p-4 rounded-lg text-sm text-accent-foreground">
                            <div className="font-medium mb-2">Gợi ý:</div>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>Dùng ít nhất 8 ký tự</li>
                                <li>Kết hợp các ký tự a-z, số 0-9 và một số ký tự đặc biệt</li>
                                <li>Không nên sử dụng những chuỗi dễ đoán như ngày sinh trong mật khẩu</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChangePassword