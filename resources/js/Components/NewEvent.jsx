import React from "react";
import InputError from "@/Components/InputError.jsx";
import { useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import format from 'date-fns/format';

export default function NewEvent({ onClose, selectedDate }) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const { users = [] } = usePage().props;

    const { data, setData, errors, post } = useForm({
        title: '',
        description: '',
        date: selectedDate ? format(new Date(selectedDate), 'yyyy-MM-dd') : '',
        time: '',
        participants: [],
    });

    const customErrors = {
        ...errors,
        title: errors.title ? "Le titre est obligatoire" : null,
        description: errors.description ? "La description est obligatoire" : null,
        date: errors.date ? "La date est obligatoire" : null,
        time: errors.time ? "L'heure est obligatoire" : null,
        participants: errors.participants ? "Au moins un participant est requis" : null,
    };

    function submit(e) {
        e.preventDefault();
        post(route('event.store'), {
            onSuccess: () => {
                onClose();
            },
        });
    }

    function handleChange(e) {
        setData(e.target.name, e.target.value);
    }

    function handleParticipantsChange(e) {
        const selected = Array.from(e.target.selectedOptions).map(opt => parseInt(opt.value, 10));
        setData('participants', selected);
    }

    return (
        <div>
            <h2 className="text-xl mb-4">Créer un nouvel événement</h2>
            <p className="text-gray-400">Remplissez les informations pour créer un événement.</p>
            <form onSubmit={submit}>
                <input type="hidden" name="_token" value={csrfToken} />

                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
                    <label htmlFor="title">Titre</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        className="rounded-md ml-3"
                        value={data.title}
                        placeholder="Titre de l'événement"
                        onChange={handleChange}
                    />
                </fieldset>
                {customErrors.title && <InputError message={customErrors.title} />}

                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        className="rounded-md ml-3"
                        value={data.description}
                        placeholder="Description de l'événement"
                        onChange={handleChange}
                    />
                </fieldset>
                {customErrors.description && <InputError message={customErrors.description} />}

                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        name="date"
                        id="date"
                        className="rounded-md ml-3"
                        value={data.date}
                        onChange={handleChange}
                    />
                </fieldset>
                {customErrors.date && <InputError message={customErrors.date} />}

                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
                    <label htmlFor="time">Heure</label>
                    <input
                        type="time"
                        name="time"
                        id="time"
                        className="rounded-md ml-3"
                        value={data.time}
                        onChange={handleChange}
                    />
                </fieldset>
                {customErrors.time && <InputError message={customErrors.time} />}

                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-start">
                    <label htmlFor="participants">Participants</label>
                    <div className="ml-3 border rounded p-2 max-h-40 overflow-y-auto">
                        {users.map((user) => (
                            <div key={user.id} className="flex items-center gap-2 mb-1">
                                <input
                                    type="checkbox"
                                    id={`user-${user.id}`}
                                    value={user.id}
                                    checked={data.participants.includes(user.id)}
                                    onChange={(e) => {
                                        const userId = parseInt(e.target.value, 10);
                                        const newParticipants = e.target.checked
                                            ? [...data.participants, userId]
                                            : data.participants.filter(id => id !== userId);
                                        setData('participants', newParticipants);
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
                {customErrors.participants && <InputError message={customErrors.participants} />}

                <div className="flex justify-end mt-8 gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-white text-black px-4 py-2 rounded-md border border-1 hover:bg-gray-100"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-white hover:text-blue-500 border border-1 border-blue-500"
                    >
                        Créer l'événement
                    </button>
                </div>
            </form>
        </div>
    );
}
