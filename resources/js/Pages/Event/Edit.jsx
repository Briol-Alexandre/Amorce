import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import MainStructure from '@/Components/MainStructure';
import TitleAndSpan from '@/Components/TitleAndSpan';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { router } from '@inertiajs/react';

export default function Edit({ event, users, selectedParticipants }) {
    const { data, setData, put, processing, errors } = useForm({
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        time: event.time || '',
        participants: selectedParticipants || [],
    });

    const [availableUsers, setAvailableUsers] = useState(users || []);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        // Initialiser les participants sélectionnés
        if (selectedParticipants && selectedParticipants.length > 0) {
            const selected = users.filter(user => selectedParticipants.includes(user.id));
            setSelectedUsers(selected);
        }
    }, [selectedParticipants, users]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('event.update', event.id), {
            onSuccess: () => {
                // Redirection vers la liste des événements
                router.visit(route('event.index'));
            },
        });
    };

    const handleCancel = () => {
        router.visit(route('event.index'));
    };

    const handleParticipantChange = (userId) => {
        const updatedParticipants = [...data.participants];
        const index = updatedParticipants.indexOf(userId);
        
        if (index === -1) {
            updatedParticipants.push(userId);
            const user = users.find(u => u.id === userId);
            if (user) {
                setSelectedUsers([...selectedUsers, user]);
            }
        } else {
            updatedParticipants.splice(index, 1);
            setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
        }
        
        setData('participants', updatedParticipants);
    };

    const removeParticipant = (userId) => {
        const updatedParticipants = data.participants.filter(id => id !== userId);
        setData('participants', updatedParticipants);
        setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
    };

    return (
        <MainStructure pageTitle="Modifier l'événement">
            <Head title="Modifier l'événement" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <TitleAndSpan title="Modifier l'événement" />
                            
                            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                                <div>
                                    <InputLabel htmlFor="title" value="Titre" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                        required
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="date" value="Date" />
                                    <TextInput
                                        id="date"
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.date} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="time" value="Heure" />
                                    <TextInput
                                        id="time"
                                        type="time"
                                        className="mt-1 block w-full"
                                        value={data.time}
                                        onChange={(e) => setData('time', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.time} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="participants" value="Participants" />
                                    <div className="mt-2">
                                        <select
                                            className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            onChange={(e) => handleParticipantChange(parseInt(e.target.value))}
                                            value=""
                                        >
                                            <option value="">Sélectionner un participant</option>
                                            {availableUsers.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <InputError message={errors.participants} className="mt-2" />
                                    
                                    {selectedUsers.length > 0 && (
                                        <div className="mt-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Participants sélectionnés:</h4>
                                            <ul className="bg-gray-50 rounded-lg p-3">
                                                {selectedUsers.map((user) => (
                                                    <li key={user.id} className="flex items-center justify-between py-1">
                                                        <div className="flex items-center">
                                                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span>{user.name}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeParticipant(user.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <SecondaryButton type="button" onClick={handleCancel} className="mr-4">
                                        Annuler
                                    </SecondaryButton>
                                    <PrimaryButton type="submit" disabled={processing}>
                                        {processing ? 'Enregistrement...' : 'Enregistrer'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </MainStructure>
    );
}
