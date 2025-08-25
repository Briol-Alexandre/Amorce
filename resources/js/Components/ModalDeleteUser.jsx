import React from "react";
import Modal from "@/Components/Modal.jsx";
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ModalDeleteUser({ show, onClose, user }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        if (user) {
            destroy(route('users.destroy', user.id), {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Confirmer la suppression
                </h2>

                <div className="mb-6">
                    <p className="text-sm text-gray-600">
                        Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
                    </p>
                    {user && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                        onClick={onClose}
                    >
                        Annuler
                    </button>
                    <PrimaryButton
                        className="bg-red-600 hover:bg-red-700"
                        disabled={processing}
                        onClick={handleDelete}
                    >
                        Supprimer
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
