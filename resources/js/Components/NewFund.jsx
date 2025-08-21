import React from "react";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError.jsx";
import { route } from "ziggy-js";

export default function NewFund({ onClose }) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');


    const { data, setData, errors, post } = useForm({
        name: '',
        description: '',
        permanent: false,
        iban: 'BE27429128531173',
        amount: 0,
    });

    const customErrors = {
        ...errors,
        name: errors.name ? "Le nom est obligatoire et doit comporter au moins 3 caractères" : null,
        description: errors.description ? "La description est obligatoire et doit comporter au moins 3 caractères" : null,
    }

    function submit(e) {
        e.preventDefault();
        post(route('fond.store'), {
            onSuccess: () => {
                console.log("Succès !");
                onClose();
            },
        });
    }


    function handleChange(e) {
        setData(e.target.name, e.target.value);
    }

    return (
        <div>
            <h2 className="text-xl mb-4">Créer un nouveau fond</h2>
            <p className="text-gray-400">Remplissez les informations pour créer un nouveau fond.</p>
            
            <form onSubmit={submit}>
                <input type="hidden" name="_token" value={csrfToken} />

                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
                    <label htmlFor="name">Nom du fond</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="rounded-md ml-3"
                        value={data.name}
                        onChange={handleChange}
                    />
                </fieldset>
                {customErrors.name && <InputError message={customErrors.name} />}

                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        className="rounded-md ml-3"
                        value={data.description}
                        onChange={handleChange}
                    />
                </fieldset>
                {customErrors.description && <InputError message={customErrors.description} />}

                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
                    <label htmlFor="iban">IBAN du fond</label>
                    <input
                        type="text"
                        name="iban"
                        id="iban"
                        className="rounded-md ml-3"
                        value={data.iban}
                        onChange={handleChange}
                    />
                </fieldset>
                {errors.iban && <InputError message={errors.iban} />}

                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
                    <label htmlFor="permanent">Fond permanent</label>
                    <div className="ml-3">
                        <input 
                            type="checkbox" 
                            name="permanent" 
                            id="permanent"
                            checked={data.permanent}
                            onChange={(e) => setData('permanent', e.target.checked || false)}
                        />
                        <label htmlFor="permanent" className="ml-2">Ce fond est-il permanent ?</label>
                    </div>
                </fieldset>

                <input
                    type="hidden"
                    name="amount"
                    value={data.amount}
                />
                
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
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-white hover:text-green-500 border border-1 border-green-500"
                    >
                        Créer le fond
                    </button>
                </div>
            </form>
        </div>
    );
}
