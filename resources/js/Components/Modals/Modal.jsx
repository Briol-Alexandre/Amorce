import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";

export default function Modal({ children, onClose, isOpen }) {
    const [show, setShow] = useState(isOpen);

    // Quand la prop isOpen change, on met à jour l'état show
    React.useEffect(() => {
        setShow(isOpen);
    }, [isOpen]);

    const handleClose = () => {
        setShow(false);
        setTimeout(() => {
            onClose(); // appel après la fin de l'animation
        }, 300); // attendre la durée de l'animation
    };

    return (
        <>
            <div
                className={`fixed inset-0 w-full h-screen bg-black bg-opacity-60 z-10 transition-opacity duration-300 ${
                    show ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={handleClose}
            />
            <div
                className={`fixed top-1/2 left-1/2 transform transition-all duration-300 z-20 bg-white rounded-lg shadow-lg p-6 ${
                    show
                        ? "-translate-x-1/2 -translate-y-1/2 scale-100 opacity-100"
                        : "-translate-x-1/2 -translate-y-1/2 scale-90 opacity-0 pointer-events-none"
                }`}
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
