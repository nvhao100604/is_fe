'use client'

import api from "@/config/axios"
import { ReactNode } from "react"
import { SWRConfig } from "swr"

const fetcher = async (url: string) => {
    const response = await api.get(url)
    return response.data
}

const SWRProvider = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <SWRConfig
                value={{
                    fetcher: fetcher,
                    revalidateOnFocus: false,
                    dedupingInterval: 10000,
                    shouldRetryOnError: false
                }}
            >
                {children}
            </SWRConfig>
        </>
    )
}

export default SWRProvider