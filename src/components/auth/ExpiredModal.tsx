'use client'
import { useRouter } from "next/navigation"
import Modal from "../common/Modal"

const ExpiredModal = () => {
    const navigation = useRouter()
    const HandleReturnLogin = () => {
        navigation.push('/auth/login')
    }

    return (
        <Modal handleClick={HandleReturnLogin}>
            <div className="flex flex-col gap-4 py-4 px-2 items-center text-xl">
                <span>Session expired. Please log in again.</span>
                <button
                    className="py-2 px-3 bg-red-500 rounded-2xl text-white hover:bg-red-700"
                    onClick={HandleReturnLogin}
                >Login again</button>
            </div>
        </Modal>
    )
}

export default ExpiredModal