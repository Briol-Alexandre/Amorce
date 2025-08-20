import React from "react";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import { Link, useForm } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";

export default function EventModal({ event, isOpen, onClose }) {
    if (!event) return null;

    const { auth } = usePage().props;
    const { delete: destroy } = useForm();

    // Vérifier si l'utilisateur est administrateur ou a des permissions spéciales
    const canEdit = auth?.user?.is_admin || auth?.user?.id === event.user_id || auth?.permissions?.includes('edit-events');
    const canDelete = auth?.user?.is_admin || auth?.user?.id === event.user_id || auth?.permissions?.includes('delete-events');

    const handleDelete = () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
            destroy(route('event.destroy', event.id), {
                onSuccess: () => {
                    onClose();
                }
            });
        }
    };

    const dateObj = event?.date ? new Date(event.date) : null;
    const formattedDate = dateObj ? dateObj.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }) : '';

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{event.title}</h2>
                </div>

                <div className="mb-4">
                    <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formattedDate}</span>
                    </div>

                    {event.time && (
                        <div className="flex items-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{event.time}</span>
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-gray-600">{event.description}</p>
                </div>

                {event.participants && event.participants.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-medium mb-2">Participants ({event.participants.length})</h3>
                        <ul className="bg-gray-50 rounded-lg p-3">
                            {event.participants.map((participant) => (
                                <li key={participant.id} className="flex items-center py-1">
                                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                                        {participant.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{participant.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex justify-between mt-6">
                    <div>
                        {canEdit && (
                            <Link href={route('event.edit', event.id)} className="mr-2">
                                <PrimaryButton>
                                    Modifier
                                </PrimaryButton>
                            </Link>
                        )}
                        {canDelete && (
                            <DangerButton onClick={handleDelete} className="mr-2">
                                Supprimer
                            </DangerButton>
                        )}
                    </div>
                    <SecondaryButton onClick={onClose}>
                        Fermer
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}
