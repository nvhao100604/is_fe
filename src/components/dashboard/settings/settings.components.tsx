import { MFASettingResponseDTO } from "@/types/response/mfasetting.response.dto"
import Link from "next/link"
import { ReactNode } from "react";

interface MethodBoxProps {
    mfaSetting: MFASettingResponseDTO | null;
    href: string;
    children: ReactNode,
    label: string,
    description: string,
    tag: string,
    handleClick: () => void;
    handleDisable: () => void;
}

const MethodBox = ({ mfaSetting,
    href,
    label,
    description,
    children,
    tag,
    handleClick,
    handleDisable
}: MethodBoxProps) => {
    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            {children}
                        </div>
                    </div>
                    <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">{label}</h4>
                        <p className="text-sm text-gray-600">
                            {mfaSetting && mfaSetting.mfaTotpEnable ? 'Enabled' : description}
                        </p>
                    </div>
                </div>
                <div>
                    {(() => {
                        if (tag === "TOTP") {
                            if (mfaSetting && mfaSetting.mfaTotpEnable) {
                                return (
                                    <button
                                        onClick={handleDisable}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                    >
                                        <Link href={href}>Disable</Link>
                                    </button>
                                );
                            } else {
                                return (
                                    <button
                                        onClick={handleClick}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-green-700"
                                    >
                                        Set up
                                    </button>
                                );
                            }
                        }
                        if (tag === "Email") {
                            if (mfaSetting && mfaSetting.mfaEmailEnabled) {
                                return (
                                    <button
                                        onClick={handleDisable}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                    >
                                        <Link href={href}>Disable</Link>
                                    </button>
                                );
                            } else {
                                return (
                                    <button
                                        onClick={handleClick}
                                                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-green-700"

                                    >
                                        Set up
                                    </button>
                                );
                            }
                        }
                        if (tag === "WebAuthn") {
                            if (mfaSetting && mfaSetting.mfaWebauthnEnabled) {
                                return (
                                    <button
                                        onClick={handleDisable}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                    >
                                        <Link href={href}>Disable</Link>
                                    </button>
                                );
                            } else {
                                return (
                                    <button
                                        onClick={handleClick}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-green-700"
                                    >
                                        Set up
                                    </button>
                                );
                            }
                        }
                    })()}                    
                </div>
            </div>
        </div>
    )
}

export { MethodBox }