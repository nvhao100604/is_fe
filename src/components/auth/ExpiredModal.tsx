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
            <div className="flex-col gap-2">
                <span>Session expired. Please log in again.</span>
                <button
                    className="p-2 bg-red-500"
                    onClick={HandleReturnLogin}
                >Login</button>
            </div>
        </Modal>
    )
}

export default ExpiredModal