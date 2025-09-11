'use client'
import { toast, ToastContainer, Zoom } from "react-toastify";
import { TOASTIFY_DEFAULT, TOASTIFY_ERROR, TOASTIFY_INFO, TOASTIFY_SUCCESS, TOASTIFY_TIME_OUT, TOASTIFY_WARNING } from "./constants";
import { ReactNode } from "react";
import Context from "./Context";

const Provider = ({ children, options }: { children: ReactNode, options?: object, }) => {
    const notify = (notification: string, type: string) => {
        switch (type) {
            case TOASTIFY_SUCCESS: return toast.success(notification, options);
            case TOASTIFY_ERROR: return toast.error(notification, options);
            case TOASTIFY_WARNING: return toast.warning(notification, options);
            case TOASTIFY_INFO: return toast.info(notification, options);
            case TOASTIFY_DEFAULT: return toast(notification, options);
        }
    }
    return (
        <Context.Provider value={{ notify }}>
            {children}
            <ToastContainer
                position="top-right"
                autoClose={TOASTIFY_TIME_OUT}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Zoom}
            />
        </Context.Provider >
    )
}

export default Provider;