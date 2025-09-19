import { MFASettingResponseDTO } from "@/types/response/mfasetting.response.dto"
import Link from "next/link"

const MethodBox = ({ mfaSetting, href, handleClick, handleDisable }:
    { mfaSetting: MFASettingResponseDTO, href: string, handleClick: () => void, handleDisable: () => void }) => {
    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                    <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">Authenticator App</h4>
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