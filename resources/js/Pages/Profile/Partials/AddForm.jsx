import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import {useState} from "react";

export default function Add() {
    const [successMessage, setSuccessMessage] = useState(false);
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        email: '',
        role: 'auth',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('compte.store'), {
            onSuccess() {
                setSuccessMessage(true);
            }
        });
    };

    return (
        <section>
            <header>
                <h4 className="text-lg font-medium text-gray-900">
                    Ajouter un nouvel utilisateur
                </h4>

                <p className="mt-1 text-sm text-gray-600">
                    Remplissez le formulaire ci-dessous pour ajouter un nouvel utilisateur.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Prénom + Nom" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
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
                        autoComplete="email"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="role" value="Rôle" />

                    <select
                        id="role"
                        className="mt-1 block w-full"
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                    >
                        <option value="auth">Administrateur</option>
                        <option value="comptable">Comptable</option>
                        <option value="user">Utilisateur</option>
                    </select>

                    <InputError className="mt-2" message={errors.role} />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Mot de passe" />

                    <TextInput
                        id="password"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        autoComplete="new-password"
                    />

                    <InputError className="mt-2" message={errors.password} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Ajouter</PrimaryButton>
                    {successMessage && (
                        <span className="text-green-600 mt-2">Utilisateur ajouté avec succès !</span>
                    )}
                </div>
            </form>
        </section>
    );
}
