import React, {useState} from "react";
import ActionButton from "@/Components/ActionButton.jsx";
import Modal from "@/Components/Modal.jsx";
import {ModalCsv} from "@/Components/Modals/ModalCsv.jsx";
import {Link, router} from "@inertiajs/react";
import {AddIcon} from "@/Components/icons/AddIcon.jsx";
import { usePage } from "@inertiajs/react";

export default function TitleAndSpan({title, onClick}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { funds } = usePage().props;
    
    function openCsvModal(e) {
        e.preventDefault();
        setIsModalOpen(true);
    }
    
    function closeModal() {
        setIsModalOpen(false);
    }
    
    function onSubmit(formData) {
        router.post(route('transaction.seed-csv-transactions'), formData, {
            forceFormData: true,
            onSuccess: () => {
                // La redirection est gérée par le contrôleur
            },
            onError: (errors) => {
                console.error('Erreur :', errors);
            },
        });
    }
    
    return (<>
        <div className="flex justify-between">
            <h2 className="title-style hover:cursor-pointer"
                onClick={onClick}>{title}</h2>
            {title === 'Fonds' && (
                <button 
                    onClick={openCsvModal}
                    className="bg-black text-white p-1 lg:p-2 rounded hover:bg-white hover:text-black border border-black
                                   text-xs lg:text-base">
                    Ajouter un Csv
                </button>
            )
            }
            {title === 'Compte' && (
                <Link href='/addUser' className="bg-black text-white p-1 lg:p-2 rounded hover:bg-white hover:text-black border border-black
                                   text-xs lg:text-base">
                    Ajouter un nouvel utilisateur
                </Link>
            )
            }
        </div>
        <span className="block h-0.5 bg-gray-300 mt-1.5"></span>
        
        {isModalOpen && (
            <Modal onClose={closeModal}>
                <ModalCsv closeModal={closeModal} onSubmit={onSubmit} />
            </Modal>
        )}
    </>);
}
