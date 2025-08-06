import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { AddIcon } from "@/Components/icons/AddIcon.jsx";
import { usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import Modal from "@/Components/Modal.jsx";
import NewFund from "@/Components/NewFund.jsx";

export default function TitleAndSpan({ title, onClick }) {
    const { funds } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (<>
        <div className="flex justify-between">
            <h2 className="title-style hover:cursor-pointer"
                onClick={onClick}>{title}</h2>
            {/* Le bouton d'ajout CSV a été intégré dans le modal d'ajout de fonds */}
            {title === 'Compte' && (
                <Link href='/addUser' className="bg-black text-white p-1 lg:p-2 rounded hover:bg-white hover:text-black border border-black
                                   text-xs lg:text-base">
                    Ajouter un nouvel utilisateur
                </Link>
            )
            }
            {title === 'Fonds' && (
                <button onClick={openModal} className="bg-black text-white p-1 lg:p-2 rounded hover:bg-white hover:text-black border border-black
                                   text-xs lg:text-base">
                    Ajouter un nouveau fond
                </button>
            )
            }
        </div>
        <span className="block h-0.5 bg-gray-300 mt-1.5"></span>
        {isModalOpen && (
            <Modal onClose={closeModal}>
                <NewFund onClose={closeModal} />
            </Modal>
        )}
    </>);
}
