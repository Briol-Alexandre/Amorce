import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

export default function Modal({ children, show = false, onClose, className = '' }) {
    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        setIsVisible(show);
    }, [show]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose(); // appel après la fin de l'animation
        }, 300); // attendre la durée de l'animation
    };


    return (
        <>
            <div
                className={`fixed inset-0 w-full h-screen bg-black bg-opacity-60 z-20 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none" // pointer-events added
                    }`}
                onClick={handleClose}
            />


            <div
                className={`fixed top-1/2 left-1/2 transform transition-all duration-300 z-20 bg-white rounded-lg shadow-lg lg:p-6 max-lg:p-4 max-w-xl lg:max-w-lg max-lg:w-[90%] ${isVisible
                    ? "-translate-x-1/2 -translate-y-1/2 scale-100 opacity-100"
                    : "-translate-x-1/2 -translate-y-1/2 scale-90 opacity-0 pointer-events-none"
                    } ${className === 'project-modal-wide' ? 'max-w-3xl lg:max-w-3xl w-[95%]' : ''} ${className}`}
            >

                <div className="w-full flex justify-end">
                    <IoMdClose
                        className="hover:cursor-pointer text-lg"
                        onClick={handleClose}
                    />
                </div>
                {children}
            </div>
        </>
    );
}
