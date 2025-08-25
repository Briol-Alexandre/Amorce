import React, { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import InputError from "@/Components/InputError";
import { useForm, usePage } from "@inertiajs/react";

export default function EventModal({ event, isOpen, onClose, users }) {
    if (!event) return null;

    const { auth } = usePage().props;
    const { delete: destroy } = useForm();

    // Mode édition
    const [editMode, setEditMode] = useState(false);

    // Formulaire pour l'édition d'événement
    const { data: editData, setData: setEditData, put: updateEvent, processing: editProcessing, errors: editErrors } = useForm({
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        time: event.time || '',
        participants: event.participants ? event.participants.map(p => p.id) : [],
    });

    // Formulaire pour l'upload du compte rendu
    const { data, setData, post, processing, errors, reset } = useForm({
        report_file: null,
    });

    const [showReportForm, setShowReportForm] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    // Mettre à jour le formulaire d'édition quand l'événement change
    useEffect(() => {
        if (event) {
            setEditData({
                title: event.title || '',
                description: event.description || '',
                date: event.date || '',
                time: event.time || '',
                participants: event.participants ? event.participants.map(p => p.id) : [],
            });

            if (event.participants) {
                setSelectedUsers(event.participants);
            }
        }
    }, [event]);

    // Vérifier si l'utilisateur est administrateur ou a des permissions spéciales
    const canEdit = auth?.user?.is_admin || auth?.user?.id === event.user_id || auth?.permissions?.includes('edit-events');
    const canDelete = auth?.user?.is_admin || auth?.user?.id === event.user_id || auth?.permissions?.includes('delete-events');

    // Vérifier si l'événement est passé et si l'utilisateur est le créateur
    const isPastEvent = new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));
    const isCreator = auth?.user?.id === event.user_id;
    const canAddReport = isPastEvent && isCreator && !event.file;

    const handleDelete = () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
            destroy(route('event.destroy', event.id), {
                onSuccess: () => {
                    onClose();
                }
            });
        }
    };

    const handleReportSubmit = (e) => {
        e.preventDefault();
        post(route('event.add-report', event.id), {
            onSuccess: () => {
                setShowReportForm(false);
                reset();
            },
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        updateEvent(route('event.update', event.id), {
            onSuccess: () => {
                setEditMode(false);
                onClose();
            },
        });
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
    };

    const handleParticipantChange = (userId) => {
        const updatedParticipants = [...editData.participants];
        const index = updatedParticipants.indexOf(userId);

        if (index === -1) {
            updatedParticipants.push(userId);
            const user = users?.find(u => u.id === userId);
            if (user) {
                setSelectedUsers([...selectedUsers, user]);
            }
        } else {
            updatedParticipants.splice(index, 1);
            setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
        }

        setEditData('participants', updatedParticipants);
    };

    const removeParticipant = (userId) => {
        const updatedParticipants = editData.participants.filter(id => id !== userId);
        setEditData('participants', updatedParticipants);
        setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
    };

    const dateObj = event?.date ? new Date(event.date) : null;
    const formattedDate = dateObj ? dateObj.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }) : '';

    // Rendu du mode édition
    if (editMode) {
        return (
            <Modal show={isOpen} onClose={handleCancelEdit}>
                <div className="lg:p-6 p-4">
                    <h2 className="lg:text-xl text-lg mb-4">Modifier l'événement</h2>
                    <p className="text-gray-400 max-lg:text-sm">Modifiez les informations de l'événement.</p>

                    <form onSubmit={handleEditSubmit}>
                        <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center max-lg:gap-1">
                            <label htmlFor="title">Titre</label>
                            <input
                                id="title"
                                type="text"
                                className="rounded-md lg:ml-3 max-lg:mt-1"
                                value={editData.title}
                                onChange={(e) => setEditData('title', e.target.value)}
                                required
                            />
                        </fieldset>
                        {editErrors.title && <InputError message={editErrors.title} />}

                        <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center max-lg:gap-1">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                className="rounded-md lg:ml-3 max-lg:mt-1"
                                value={editData.description}
                                onChange={(e) => setEditData('description', e.target.value)}
                                rows={4}
                                required
                            />
                        </fieldset>
                        {editErrors.description && <InputError message={editErrors.description} />}

                        <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center max-lg:gap-1">
                            <label htmlFor="date">Date</label>
                            <input
                                id="date"
                                type="date"
                                className="rounded-md lg:ml-3 max-lg:mt-1"
                                value={editData.date}
                                onChange={(e) => setEditData('date', e.target.value)}
                                required
                            />
                        </fieldset>
                        {editErrors.date && <InputError message={editErrors.date} />}

                        <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
                            <label htmlFor="time">Heure</label>
                            <input
                                id="time"
                                type="time"
                                className="rounded-md ml-3"
                                value={editData.time}
                                onChange={(e) => setEditData('time', e.target.value)}
                                required
                            />
                        </fieldset>
                        {editErrors.time && <InputError message={editErrors.time} />}

                        {users && (
                            <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-start">
                                <label htmlFor="participants">Participants</label>
                                <div className="lg:ml-3 max-lg:mt-1 border rounded p-2 max-h-40 overflow-y-auto">
                                    {users.map((user) => (
                                        <div key={user.id} className="flex items-center gap-2 mb-1">
                                            <input
                                                type="checkbox"
                                                id={`user-${user.id}`}
                                                value={user.id}
                                                checked={editData.participants.includes(user.id)}
                                                onChange={(e) => {
                                                    const userId = parseInt(e.target.value, 10);
                                                    const newParticipants = e.target.checked
                                                        ? [...editData.participants, userId]
                                                        : editData.participants.filter(id => id !== userId);
                                                    setEditData('participants', newParticipants);

                                                    // Mettre à jour la liste des utilisateurs sélectionnés pour l'affichage
                                                    if (e.target.checked) {
                                                        const user = users.find(u => u.id === userId);
                                                        if (user) {
                                                            setSelectedUsers([...selectedUsers, user]);
                                                        }
                                                    } else {
                                                        setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
                                                    }
                                                }}
                                                className="rounded"
                                            />
                                            <label htmlFor={`user-${user.id}`} className="text-sm">
                                                {user.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                        )}
                        {editErrors.participants && <InputError message={editErrors.participants} />}

                        <div className="flex justify-end mt-8 gap-4">
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="bg-white text-black px-4 py-2 rounded-md border border-1 hover:bg-gray-100"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={editProcessing}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-white hover:text-blue-500 border border-1 border-blue-500"
                            >
                                {editProcessing ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        );
    }

    // Rendu du mode affichage
    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-xl mb-4">{event.title}</h2>

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

                {/* Affichage du compte rendu s'il existe */}
                {event.file && (
                    <div className="mb-6">
                        <h3 className="font-medium mb-2">Compte rendu</h3>
                        <a
                            href={`/storage/${event.file}`}
                            target="_blank"
                            className="text-blue-600 hover:underline flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Télécharger le compte rendu (PDF)
                        </a>
                    </div>
                )}

                {/* Formulaire d'ajout de compte rendu */}
                {canAddReport && !showReportForm && (
                    <div className="mb-6">
                        <button
                            onClick={() => setShowReportForm(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-white hover:text-blue-500 border border-1 border-blue-500"
                        >
                            Ajouter un compte rendu
                        </button>
                    </div>
                )}

                {canAddReport && showReportForm && (
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-3">Ajouter un compte rendu</h3>
                        <form onSubmit={handleReportSubmit}>
                            <fieldset className="mb-4">
                                <label htmlFor="report_file" className="block text-sm font-medium text-gray-700 mb-1">
                                    Fichier PDF (max. 10 Mo)
                                </label>
                                <input
                                    type="file"
                                    id="report_file"
                                    accept=".pdf"
                                    className="w-full border-gray-300 rounded-md"
                                    onChange={e => setData('report_file', e.target.files[0])}
                                    required
                                />
                                {errors.report_file && <InputError message={errors.report_file} />}
                            </fieldset>
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-white hover:text-blue-500 border border-1 border-blue-500"
                                >
                                    {processing ? 'Envoi en cours...' : 'Envoyer'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowReportForm(false)}
                                    className="bg-white text-black px-4 py-2 rounded-md border border-1 hover:bg-gray-100"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                )}

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

                <div className="flex justify-end mt-8 gap-4">
                    {canDelete && !editMode && (
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-white hover:text-red-500 border border-1 border-red-500"
                        >
                            Supprimer
                        </button>
                    )}
                    {canEdit && !isPastEvent && !editMode && (
                        <button
                            onClick={handleEditClick}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-white hover:text-blue-500 border border-1 border-blue-500"
                        >
                            Modifier
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="bg-white text-black px-4 py-2 rounded-md border border-1 hover:bg-gray-100"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </Modal>
    );
}
