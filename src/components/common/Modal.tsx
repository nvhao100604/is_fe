'use client'
import { ReactElement, useEffect } from "react"
import { createPortal } from "react-dom"

const Modal = ({ children, handleClick }: { children: ReactElement, handleClick: () => void }) => {
    useEffect(() => {
        const handleEscape = (e: any) => {
            if (e.key === 'Escape') {
                handleClick();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    return createPortal(
        <div className="fixed inset-0 z-1000 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClick}></div>
            <div className="relative bg-white rounded-lg max-w-2xl w-full p-6 z-51">
                {children}
            </div>
        </div>,
        document.body
    )
}

export default Modal