import { MFASettingResponseDTO } from "@/types/response/mfasetting.response.dto"
import Link from "next/link"
import { ReactNode } from "react";


interface MethodBoxProps {
    mfaSetting: MFASettingResponseDTO;
    href: string;
    children: ReactNode,
    label: string,
    handleClick: () => void;
    handleDisable: () => void;
}

const MethodBox = ({ mfaSetting,
    href,
    label,
    children,
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
                            {mfaSetting.mfaTotpEnable ? 'Enabled' : 'Use an app like Google Authenticator or Authy'}
                        </p>
                    </div>
                </div>
                <div>
                    {mfaSetting.mfaTotpEnable ? (
                        <button
                            onClick={handleClick}
                            className="text-sm text-red-600 hover:text-red-800"
                        >
                            Create
                        </button>
                    ) : (
                        <button
                            onClick={handleDisable}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                            <Link href={href}>Disable</Link>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export { MethodBox }