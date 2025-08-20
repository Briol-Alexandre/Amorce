import React from "react";
import TextAndLabel from "@/Components/TextAndLabel.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import InputError from "@/Components/InputError.jsx";
import { useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function NewEvent({ onClose }) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const { users = [] } = usePage().props;

    const { data, setData, errors, post } = useForm({
        title: '',
        description: '',
        date: '',
        participants: [],
    });

    const customErrors = {
        ...errors,
        title: errors.title ? "Le titre est obligatoire" : null,
        description: errors.description ? "La description est obligatoire" : null,
        date: errors.date ? "La date est obligatoire" : null,
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
        <div className="flex flex-col items-center">
            <form className="grid grid-row-[1fr_1fr] gap-6 w-full max-w-sm" onSubmit={submit}>
                <legend className="text-lg font-semibold">Créer un nouvel événement</legend>
                <input type="hidden" name="_token" value={csrfToken} />

                <div>
                    <TextAndLabel
                        type="text"
                        value={data.title}
                        idAndFor="title"
                        errors={errors?.title}
                        labelName="Titre"
                        inputName="title"
                        containerClassName="flex items-center gap-4 justify-between"
                        labelClassName="text-sm"
                        onChange={handleChange}
                    />
                    <InputError message={customErrors.title} />
                </div>

                <div>
                    <TextAndLabel
                        type="text"
                        value={data.description}
                        idAndFor="description"
                        errors={errors?.description}
                        labelName="Description"
                        inputName="description"
                        containerClassName="flex items-center gap-4 justify-between"
                        labelClassName="text-sm"
                        onChange={handleChange}
                    />
                    <InputError message={customErrors.description} />
                </div>

                <div>
                    <TextAndLabel
                        type="date"
                        value={data.date}
                        idAndFor="date"
                        errors={errors?.date}
                        labelName="Date"
                        inputName="date"
                        containerClassName="flex items-center gap-4 justify-between"
                        labelClassName="text-sm"
                        onChange={handleChange}
                    />
                    <InputError message={customErrors.date} />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm">Participants</label>
                    <div className="border rounded p-2 max-h-40 overflow-y-auto">
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
                    <InputError message={errors.participants} />
                </div>

                <div className="flex justify-end">
                    <PrimaryButton children="Créer l'événement" className="normal-case text-sm" />
                </div>
            </form>
        </div>
    );
}
