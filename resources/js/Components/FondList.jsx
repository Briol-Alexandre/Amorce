import Fond from "@/Components/Fond.jsx";
import {AddIcon} from "@/Components/icons/AddIcon.jsx";
import React, {useState} from "react";
import Modal from "@/Components/Modal.jsx";
import NewFund from "@/Components/NewFund.jsx";

export function FondList({fonds, errors, displayFund}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <section className="flex justify-around mt-4">
                <h3 className="sr-only">Fonds</h3>
                {fonds.map((fond) => (
                    <Fond
                        key={fond.id}
                        foundName={fond.name}
                        foundAmount={fond.amount}
                        foundRaise={fond.raise}
                        fond={fond}
                        displayFund={displayFund}
                    />
                ))}
                <div
                    className="flex flex-col items-center mr-10 hover:cursor-pointer"
                    onClick={openModal} // Ouvre la modal au clic
                >
                    <AddIcon color={'black'}/>
                    <p>Ajouter un fond</p>
                </div>
            </section>
            <span className="block h-0.5 bg-gray-300 mt-4"></span>

            {/* Modal */}
            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <NewFund onClose={closeModal} errors={errors} />
                </Modal>
            )}
        </>
    );
}
