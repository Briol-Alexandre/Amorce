import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import {useForm} from '@inertiajs/react';
import {useState} from "react";
import {usePage} from '@inertiajs/react';

export default function Add() {
    const { permissions } = usePage().props;
    const [successMessage, setSuccessMessage] = useState(false);
    const {data, setData, post, errors, processing} = useForm({
        name: '',
        email: '',
        permissions: [],
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
                <strong className='text-gray-600'>
                    Un e-mail sera envoyé à l'adresse mail renseignée avec les identifiants.
                </strong>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Prénom + Nom"/>

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name}/>
                </div>

                <div>
                    <InputLabel htmlFor="email" value="E-mail"/>

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="email"
                    />

                    <InputError className="mt-2" message={errors.email}/>
                </div>

                <div>
                    <InputLabel htmlFor="permissions" value="Permissions"/>
                    
                    <div className="mt-2 border border-gray-300 rounded-md p-2 max-h-60 overflow-y-auto">
                        {permissions.map((permission) => (
                            <div key={permission.id} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id={`permission-${permission.id}`}
                                    className="mr-2"
                                    checked={data.permissions.includes(permission.id)}
                                    onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        setData('permissions', isChecked
                                            ? [...data.permissions, permission.id]
                                            : data.permissions.filter(id => id !== permission.id)
                                        );
                                    }}
                                />
                                <label htmlFor={`permission-${permission.id}`} className="text-sm">
                                    <span className="font-medium">{permission.name}</span>
                                    <p className="text-xs text-gray-500">{permission.description}</p>
                                </label>
                            </div>
                        ))}
                    </div>

                    <InputError className="mt-2" message={errors.permissions}/>
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Mot de passe"/>

                    <TextInput
                        id="password"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        autoComplete="new-password"
                    />

                    <InputError className="mt-2" message={errors.password}/>
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
