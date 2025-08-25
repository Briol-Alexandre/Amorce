import React, { useState } from "react";
import InputError from "@/Components/InputError.jsx";

export function ModalReceive({ closeModal, handleReceive, fund, funds }) {
    const activeFundId = fund.id;

    const currentDate = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        amount: "",
        fund_id: "",
        destinationFundId: fund.id,
        transactor: "",
        communication: "",
        date: currentDate,
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;


        setFormData((prevData) => {
            const newData = {
                ...prevData,
                [name]: value,
            };


            if (name === 'fund_id' && value) {
                const sourceFund = funds.find(f => f.id == value);
                if (sourceFund) {
                    newData.transactor = sourceFund.name;
                }
            }

            return newData;
        });

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    const validateForm = () => {
        let formErrors = {};

        if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
            formErrors.amount = "Le montant est requis et doit être un nombre valide supérieur à 0.";
        }

        if (!formData.fund_id) {
            formErrors.fund_id = "Veuillez sélectionner un fond source.";
        }


        if (formData.fund_id) {
            const sourceFund = funds.find(f => f.id == formData.fund_id);
            if (sourceFund && formData.amount > sourceFund.amount) {
                formErrors.amount = `Le montant à transférer ne peut pas être supérieur au montant disponible dans ${sourceFund.name} (${sourceFund.amount}€)`;
            }
        }



        if (!formData.communication) {
            formErrors.communication = "La communication est requise.";
        }

        if (!formData.date) {
            formErrors.date = "La date est requise.";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            handleReceive(formData);
            closeModal();
        }
    };

    return (
        <div>
            <h2 className="lg:text-xl max-lg:text-lg max-lg:font-semibold max-lg:mt-2 mb-2 lg:mb-4">Recevoir de l'argent vers ce fond</h2>
            <p className="text-gray-400 max-lg:text-sm max-lg:mt-1">Sélectionnez un fond source pour transférer de l'argent vers <strong>{fund.name}</strong>.</p>
            <form onSubmit={onSubmit}>
                <fieldset className="mt-3 self-end grid lg:grid-cols-[1fr_3fr] max-lg:grid-cols-1 items-center">
                    <label htmlFor="amount" className="max-lg:text-sm">Montant</label>
                    <input
                        type="text"
                        name="amount"
                        id="amount"
                        className="rounded-md lg:ml-3 max-lg:mt-1"
                        value={formData.amount}
                        placeholder="XX €"
                        onChange={handleInputChange}
                    />
                </fieldset>
                {errors.amount && <InputError message={errors.amount} />}

                <fieldset className="mt-3 self-end grid lg:grid-cols-[1fr_3fr] max-lg:grid-cols-1 items-center">
                    <label htmlFor="fonds" className="max-lg:text-sm">Depuis quel fond</label>
                    <select
                        name="fund_id"
                        id="fonds"
                        className="rounded-md lg:ml-3 max-lg:mt-1"
                        value={formData.fund_id}
                        onChange={handleInputChange}
                    >
                        <option value="">Sélectionnez un fond source</option>
                        {funds
                            .filter((fund) => fund.id !== activeFundId)
                            .map((fund) => (
                                <option value={fund.id} key={fund.id}>
                                    {fund.name} ({fund.amount}€)
                                </option>
                            ))}
                    </select>
                </fieldset>
                {errors.fund_id && <InputError message={errors.fund_id} />}

                <fieldset className="mt-3 self-end grid lg:grid-cols-[1fr_3fr] max-lg:grid-cols-1 items-center">
                    <label htmlFor="transactor" className="max-lg:text-sm">Transacteur</label>
                    <input
                        type="text"
                        name="transactor"
                        id="transactor"
                        className="rounded-md lg:ml-3 max-lg:mt-1 bg-gray-100"
                        value={formData.transactor}
                        readOnly
                        title="Le transacteur est automatiquement défini comme le fond source"
                    />
                </fieldset>

                <fieldset className="mt-3 self-end grid lg:grid-cols-[1fr_3fr] max-lg:grid-cols-1 items-center">
                    <label htmlFor="communication" className="max-lg:text-sm">Communication</label>
                    <input
                        type="text"
                        name="communication"
                        id="communication"
                        className="rounded-md lg:ml-3 max-lg:mt-1"
                        value={formData.communication}
                        placeholder="Entrez une communication"
                        onChange={handleInputChange}
                    />
                </fieldset>
                {errors.communication && <InputError message={errors.communication} />}

                <fieldset className="mt-3 self-end grid lg:grid-cols-[1fr_3fr] max-lg:grid-cols-1 items-center">
                    <input
                        type="hidden"
                        name="date"
                        id="date"
                        className="rounded-md lg:ml-3 max-lg:mt-1"
                        value={formData.date}
                        onChange={handleInputChange}
                    />
                </fieldset>
                {errors.date && <InputError message={errors.date} />}

                <div className="flex justify-end mt-8 lg:gap-4 max-lg:gap-2">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="bg-white text-black lg:px-4 lg:py-2 max-lg:px-2 max-lg:py-1 max-lg:text-sm rounded-md border border-1 hover:bg-gray-100"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="bg-purple-500 text-white lg:px-4 lg:py-2 max-lg:px-2 max-lg:py-1 max-lg:text-sm rounded-md hover:bg-white hover:text-purple-500 border border-1 border-purple-500"
                    >
                        Recevoir
                    </button>
                </div>
            </form>
        </div>
    );
}
