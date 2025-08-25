import React, { useState } from "react";
import ActionButton from "@/Components/ActionButton.jsx";
import Modal from "@/Components/Modal.jsx";
import { ModalDelete } from "@/Components/Modals/ModalDelete.jsx";
import { ModalTransfer } from "@/Components/Modals/ModalTransfer.jsx";
import { ModalAdd } from "@/Components/Modals/ModalAdd.jsx";
import { ModalEdit } from "@/Components/Modals/ModalEdit.jsx";
import { ModalReceive } from "@/Components/Modals/ModalReceive.jsx";
import { ModalTransferBeforeDelete } from "@/Components/Modals/ModalTransferBeforeDelete.jsx";
import { router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";

export default function FondAction({ fund, funds }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isTransferBeforeDeleteModalOpen, setIsTransferBeforeDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const auth = usePage().props.auth;

    function openDeleteModal(e) {
        e.preventDefault();
        // Vérifier si le fond a de l'argent
        if (fund.amount > 0) {
            // Si le fond a de l'argent, ouvrir la modale de transfert avant suppression
            setIsTransferBeforeDeleteModalOpen(true);
        } else {
            // Si le fond est vide, ouvrir directement la modale de suppression
            setIsDeleteModalOpen(true);
        }
    }

    function openAddModal(e) {
        e.preventDefault();
        setIsAddModalOpen(true);
    }

    function openTransferModal(e) {
        e.preventDefault();
        setIsTransferModalOpen(true);
    }

    function openReceiveModal(e) {
        e.preventDefault();
        setIsReceiveModalOpen(true);
    }

    function openEditModal(e) {
        e.preventDefault();
        setIsEditModalOpen(true);
    }

    function closeModal() {
        setIsDeleteModalOpen(false);
        setIsTransferBeforeDeleteModalOpen(false);
        setIsAddModalOpen(false);
        setIsTransferModalOpen(false);
        setIsReceiveModalOpen(false);
        setIsEditModalOpen(false);
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

    function handleReceive(formData) {
        console.log('Sending receive data:', formData);

        // Pour la réception, on utilise le fond source comme paramètre de route
        const sourceFund = funds.find(f => f.id == formData.fund_id);

        router.patch(route('transaction.update', { fund: sourceFund }), formData, {
            onSuccess: (response) => {
                console.log('Transfert reçu avec succès:', response);
                closeModal();
            },
            onError: (error) => {
                console.error('Erreur lors de la réception:', error);
            },
        });
    }


    function handleEdit(formData) {
        router.patch(route('fond.update', fund.id), formData, {
            onSuccess: (page) => {
                closeModal();
                // Optionnel: afficher un message de succès
                console.log('Fond modifié avec succès');
            },
            onError: (errors) => {
                console.error('Erreur lors de la modification du fond:', errors);
                // Les erreurs de validation seront affichées automatiquement par Inertia
            },
            onFinish: () => {
                // Cette fonction est appelée dans tous les cas (succès ou erreur)
                console.log('Requête terminée');
            }
        });
    }

    function handleTransferAndDelete(transfersData) {
        console.log('Transferts multiples avant suppression:', transfersData);

        // Utiliser la nouvelle route pour les transferts multiples
        router.post(route('fond.transfer-multiple', { fund: fund }), {
            transfers: transfersData
        }, {
            onSuccess: (page) => {
                console.log('Tous les transferts effectués avec succès, suppression du fond...');
                // Vérifier si les transferts ont été complétés
                if (page.props.flash?.transfersCompleted) {
                    // Une fois tous les transferts réussis, supprimer le fond
                    router.delete(route('fond.destroy', fund.id), {
                        onSuccess: () => {
                            console.log('Fond supprimé avec succès après transferts multiples');
                            closeModal();
                        },
                        onError: (error) => {
                            console.error('Erreur lors de la suppression du fond:', error);
                        }
                    });
                } else {
                    console.log('Transferts effectués, mais pas de flag de confirmation');
                    // Essayer quand même de supprimer
                    router.delete(route('fond.destroy', fund.id), {
                        onSuccess: () => {
                            console.log('Fond supprimé avec succès');
                            closeModal();
                        },
                        onError: (error) => {
                            console.error('Erreur lors de la suppression du fond:', error);
                        }
                    });
                }
            },
            onError: (errors) => {
                console.error('Erreur lors des transferts multiples:', errors);
                // Les erreurs seront affichées automatiquement par Inertia dans la modale
            },
        });
    }

    function handleDelete(e) {
        e.preventDefault();
        router.delete(route('fond.destroy', fund.id));
        setIsDeleteModalOpen(false);
    }

    return (
        <section className="max-lg:w-full">
            <h3 className="sr-only">Fond Principal</h3>

            <div className='flex flex-row justify-between lg:justify-center flex-wrap '>
                {auth.user && auth.user.permissions && auth.user.permissions.includes('manage-funds') && (
                    <>
                        <ActionButton name="Ajouter de l'argent" color={'blue'} onClick={openAddModal} />
                        <ActionButton name="Recevoir depuis un autre fond" color={'purple'} onClick={openReceiveModal} />
                        <ActionButton name="Transferer vers un autre fond" color={'green'} onClick={openTransferModal} />
                    </>
                )}
                {auth.user && auth.user.permissions && auth.user.permissions.includes('edit-delete-funds') && (
                    <ActionButton name="Modifier le fond" color={'orange'} onClick={openEditModal} />
                )}
                {auth.user && auth.user.permissions && auth.user.permissions.includes('edit-delete-funds') && !fund.permanent && (
                    <ActionButton name="Supprimer le fond" color={'red'} onClick={openDeleteModal} />
                )}
            </div>

            <Modal show={isDeleteModalOpen} onClose={closeModal}>
                <ModalDelete closeModal={closeModal} handleDelete={handleDelete} />
            </Modal>

            <Modal show={isTransferBeforeDeleteModalOpen} onClose={closeModal}>
                <ModalTransferBeforeDelete
                    closeModal={closeModal}
                    handleTransferAndDelete={handleTransferAndDelete}
                    fund={fund}
                    funds={funds}
                />
            </Modal>

            <Modal show={isAddModalOpen} onClose={closeModal}>
                <ModalAdd closeModal={closeModal} handleAdd={handleAdd} fund={fund} />
            </Modal>

            <Modal show={isTransferModalOpen} onClose={closeModal}>
                <ModalTransfer closeModal={closeModal} handleTransfer={handleTransfer} funds={funds} fund={fund} />
            </Modal>

            <Modal show={isReceiveModalOpen} onClose={closeModal}>
                <ModalReceive closeModal={closeModal} handleReceive={handleReceive} funds={funds} fund={fund} />
            </Modal>

            <Modal show={isEditModalOpen} onClose={closeModal}>
                <ModalEdit closeModal={closeModal} handleEdit={handleEdit} fund={fund} />
            </Modal>
        </section>
    );
}
