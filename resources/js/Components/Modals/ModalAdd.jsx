import React, { useState } from "react";
import InputError from "@/Components/InputError.jsx";

export function ModalAdd({ closeModal, handleAdd, fund }) {
    const [formData, setFormData] = useState({
        amount: "24",
        date: "",
        transactor: "John Doe",
        communication: "Test",
        fundId: fund.id, // ID du fond pré-rempli
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Fonction de validation
    const validateForm = () => {
        let formErrors = {};

        if (!formData.amount || isNaN(formData.amount)) {
            formErrors.amount = "Le montant est requis et doit être un nombre valide.";
        }

        if (!formData.date) {
            formErrors.date = "La date est requise.";
        }

        if (!formData.transactor) {
            formErrors.transactor = "Le nom du transacteur est requis.";
        }

        if (!formData.communication) {
            formErrors.communication = "La communication est requise.";
        }

        setErrors(formErrors);

        return Object.keys(formErrors).length === 0; // Retourne true si aucune erreur
    };

    const onSubmit = (e) => {
        e.preventDefault();

        // Validation avant l'envoi
        if (validateForm()) {
            handleAdd(formData);
            closeModal();
        }
    };

    return (
        <div>
            <h2 className="text-xl">Voulez-vous ajouter de l'argent à ce fond&nbsp;?</h2>
            <p className="text-gray-400">Entrez les informations nécessaires.</p>
            <form onSubmit={onSubmit}>
                <input
                    type="hidden"
                    name="fundId"
                    value={formData.fundId}
                />
                <fieldset className="mt-5 self-end">
                    <label htmlFor="amount">Montant</label>
                    <input
                        type="text"
                        name="amount"
                        id="amount"
                        className="rounded-md ml-3"
                        value={formData.amount}
                        placeholder="XX €"
                        onChange={handleInputChange}
                    />
                    {errors.amount && <InputError message={errors.amount} />}
                </fieldset>
                <fieldset className="mt-5 self-end">
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        name="date"
                        id="date"
                        className="rounded-md ml-3"
                        value={formData.date}
                        onChange={handleInputChange}
                    />
                    {errors.date && <InputError message={errors.date} />}
                </fieldset>
                <fieldset className="mt-5 self-end">
                    <label htmlFor="transactor">Transacteur</label>
                    <input
                        type="text"
                        name="transactor"
                        id="transactor"
                        className="rounded-md ml-3"
                        value={formData.transactor}
                        placeholder="Mr. Doe"
                        onChange={handleInputChange}
                    />
                    {errors.transactor && <InputError message={errors.transactor} />}
                </fieldset>
                <fieldset className="mt-5 self-end">
                    <label htmlFor="communication">Communication</label>
                    <input
                        type="text"
                        name="communication"
                        id="communication"
                        className="rounded-md ml-3"
                        value={formData.communication}
                        placeholder="Entrez une communication"
                        onChange={handleInputChange}
                    />
                    {errors.communication && <InputError message={errors.communication} />}
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
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-white hover:text-blue-500 border border-1 border-blue-500"
                    >
                        Ajouter
                    </button>
                </div>
            </form>
        </div>
    );
}
