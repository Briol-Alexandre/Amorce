import React, { useEffect } from "react";
import Modal from "@/Components/Modal.jsx";
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';

export default function ModalEditUser({ show, onClose, user, permissions }) {
    const { data, setData, patch, errors, processing, reset } = useForm({
        name: '',
        email: '',
        permissions: [],
    });

    useEffect(() => {
        if (user) {
            setData({
                name: user.name || '',
                email: user.email || '',
                permissions: user.permissions ? user.permissions.map(p => p.id) : [],
            });
        }
    }, [user]);

    const submit = (e) => {
        e.preventDefault();

        patch(route('users.update', user.id), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    const handleCheckboxChange = (permissionId) => {
        const isChecked = data.permissions.includes(permissionId);
        setData('permissions', isChecked
            ? data.permissions.filter(id => id !== permissionId)
            : [...data.permissions, permissionId]
        );
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Modifier l'utilisateur
                </h2>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="name" value="Prénom + Nom" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="E-mail" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    <div>
                        <InputLabel htmlFor="permissions" value="Permissions" />
                        <div className="mt-2 border border-gray-300 rounded-md p-2 max-h-60 overflow-y-auto">
                            {permissions && permissions.map((permission) => (
                                <div key={permission.id} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id={`permission-${permission.id}`}
                                        className="mr-2"
                                        checked={data.permissions.includes(permission.id)}
                                        onChange={() => handleCheckboxChange(permission.id)}
                                    />
                                    <label htmlFor={`permission-${permission.id}`} className="text-sm">
                                        <span className="font-medium">{permission.name}</span>
                                        <p className="text-xs text-gray-500">{permission.description}</p>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <InputError className="mt-2" message={errors.permissions} />
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                            onClick={onClose}
                        >
                            Annuler
                        </button>
                        <PrimaryButton disabled={processing}>
                            Enregistrer
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
