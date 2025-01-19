import React, { useState } from "react";
import ActionButton from "@/Components/ActionButton.jsx";
import Modal from "@/Components/Modal.jsx";
import { ModalDelete } from "@/Components/Modals/ModalDelete.jsx";
import { ModalTransfer } from "@/Components/Modals/ModalTransfer.jsx";
import { ModalAdd } from "@/Components/Modals/ModalAdd.jsx";
import {router} from "@inertiajs/react";
import {ModalCsv} from "@/Components/Modals/ModalCsv.jsx";

export default function FondAction({ fund, funds }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);


    function openDeleteModal(e) {
        e.preventDefault();
        setIsDeleteModalOpen(true);
    }

    function openAddModal(e) {
        e.preventDefault();
        setIsAddModalOpen(true);
    }

    function openTransferModal(e) {
        e.preventDefault();
        setIsTransferModalOpen(true);
    }

    function closeModal() {
        setIsDeleteModalOpen(false);
        setIsAddModalOpen(false);
        setIsTransferModalOpen(false);
    }

    function handleAdd(formData) {
        router.post(route('transaction.store', { fund: fund }), formData);
        closeModal();
    }


    function handleTransfer(formData) {
        console.log('Sending transfer data:', formData);

        router.patch(route('transaction.update', { fund: fund }), formData, {
            onSuccess: (response) => {
                console.log('Données envoyées avec succès:', response);
                closeModal();
            },
            onError: (error) => {
                console.error('Erreur lors de l\'envoi des données:', error);
            },
        });
    }


    function handleDelete(e) {
        e.preventDefault();
        router.delete(route('fond.destroy', fund.id));
        setIsDeleteModalOpen(false);
    }

    return (
        <section className='m-8'>
            <h3 className="sr-only">Fond Principal</h3>
            <div className='flex flex-col lg:flex-row lg:justify-around gap-3 lg:gap-0'>
                {!fund.permanent && (
                    <ActionButton name="Supprimer le fond" color={'red'} onClick={openDeleteModal} />
                )}

                <ActionButton name="Ajouter de l'argent" color={'blue'} onClick={openAddModal} />
                <ActionButton name="Transferer vers un autre fond" color={'green'} onClick={openTransferModal} />
            </div>

            {isDeleteModalOpen && (
                <Modal onClose={closeModal}>
                    <ModalDelete closeModal={closeModal} handleDelete={handleDelete} />
                </Modal>
            )}

            {isAddModalOpen &&  (
                <Modal onClose={closeModal}>
                    <ModalAdd closeModal={closeModal} handleAdd={handleAdd} fund={fund} />
                </Modal>
            )}

            {isTransferModalOpen &&  (
                <Modal onClose={closeModal}>
                    <ModalTransfer closeModal={closeModal} handleTransfer={handleTransfer} funds={funds} fund={fund} />
                </Modal>
            )}
        </section>
    );
}
