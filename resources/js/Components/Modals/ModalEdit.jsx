import React, { useState } from "react";
import InputError from "@/Components/InputError.jsx";

export function ModalEdit({ closeModal, handleEdit, fund }) {
    const [formData, setFormData] = useState({
        name: fund.name || "",
        iban: fund.iban || "",
        description: fund.description || "",
        permanent: Boolean(fund.permanent),
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        let formErrors = {};

        // Si c'est un fond principal (ID 1 ou 2), on vérifie uniquement la description
        if (fund.id === 1 || fund.id === 2) {
            if (!formData.description.trim()) {
                formErrors.description = "La description est requise.";
            }
        } else {
            // Validation complète pour les autres fonds
            if (!formData.name.trim()) {
                formErrors.name = "Le nom du fond est requis.";
            }

            if (!formData.description.trim()) {
                formErrors.description = "La description est requise.";
            }

            if (formData.iban && !/^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/.test(formData.iban.replace(/\s/g, ''))) {
                formErrors.iban = "L'IBAN doit être au format valide. Ex: BE68 5390 0754 7034";
            }
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (validateForm() && !isSubmitting) {
            setIsSubmitting(true);

            // Si c'est un fond principal (ID 1 ou 2), on n'envoie que la description
            if (fund.id === 1 || fund.id === 2) {
                handleEdit({
                    description: formData.description
                });
            } else {
                handleEdit(formData);
            }

            // closeModal() sera appelé dans handleEdit en cas de succès
            // En cas d'erreur, on remet isSubmitting à false
            setTimeout(() => setIsSubmitting(false), 3000);
        }
    };

    return (
        <div>
            <h2 className="text-xl">Modifier le fond</h2>
            <p className="text-gray-400">
                {(fund.id === 1 || fund.id === 2)
                    ? "Seule la description peut être modifiée pour ce fond principal."
                    : "Modifiez les informations du fond."}
            </p>
            <form onSubmit={onSubmit}>
                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
                    <label htmlFor="name">Nom du fond</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className={`rounded-md ml-3 ${(fund.id === 1 || fund.id === 2) ? 'bg-gray-100' : ''}`}
                        value={formData.name}
                        placeholder="Nom du fond"
                        onChange={handleInputChange}
                        disabled={fund.id === 1 || fund.id === 2}
                        title={(fund.id === 1 || fund.id === 2) ? "Le nom d'un fond principal ne peut pas être modifié" : ""}
                    />
                </fieldset>
                {errors.name && <InputError message={errors.name} />}

                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
                    <label htmlFor="description">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        className="rounded-md ml-3"
                        value={formData.description}
                        placeholder="Description du fond"
                        onChange={handleInputChange}
                        rows="3"
                    />
                </fieldset>
                {errors.description && <InputError message={errors.description} />}

                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
                    <label htmlFor="iban">IBAN</label>
                    <input
                        type="text"
                        name="iban"
                        id="iban"
                        className={`rounded-md ml-3 ${(fund.id === 1 || fund.id === 2) ? 'bg-gray-100' : ''}`}
                        value={formData.iban}
                        placeholder="BE68 5390 0754 7034"
                        onChange={handleInputChange}
                        disabled={fund.id === 1 || fund.id === 2}
                        title={(fund.id === 1 || fund.id === 2) ? "L'IBAN d'un fond principal ne peut pas être modifié" : ""}
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
                            className="rounded"
                            checked={formData.permanent}
                            onChange={handleInputChange}
                            disabled={fund.id === 1 || fund.id === 2}
                            title={(fund.id === 1 || fund.id === 2) ? "Le statut permanent d'un fond principal ne peut pas être modifié" : ""}
                        />
                        <span className="ml-2 text-sm text-gray-600">
                            Ce fond ne peut pas être supprimé
                        </span>
                    </div>
                </fieldset>

                <div className="flex justify-end mt-8 gap-4">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="bg-white text-black px-4 py-2 rounded-md border border-1 hover:bg-gray-100"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 rounded-md border border-1 transition-colors ${isSubmitting
                            ? 'bg-gray-400 text-white cursor-not-allowed border-gray-400'
                            : 'bg-orange-500 text-white hover:bg-white hover:text-orange-500 border-orange-500'
                            }`}
                    >
                        {isSubmitting ? 'Modification...' : 'Modifier'}
                    </button>
                </div>
            </form>
        </div>
    );
}
