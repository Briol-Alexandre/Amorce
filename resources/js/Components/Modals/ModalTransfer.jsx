import React, {useState} from "react";
import InputError from "@/Components/InputError.jsx";

export function ModalTransfer({closeModal, handleTransfer, fund, funds}) {
    const activeFundId = fund.id;

    const currentDate = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        amount: "",
        fund_id: fund.id,
        destinationFundId: "",
        transactor: "John Doe",
        communication: "",
        date: currentDate,
    });



    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
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

        if (formData.amount > fund.amount) {
            formErrors.amount = "Le montant à transférer ne peut pas être supérieur au montant disponible dans le fond"
        }

        if (!formData.destinationFundId) {
            formErrors.destinationFundId = "Veuillez sélectionner un fond destinataire.";
        }

        if (!formData.transactor) {
            formErrors.transactor = "Le nom du transacteur est requis.";
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
            handleTransfer(formData);
            closeModal();
        }
    };

    return (
        <div>
            <h2 className="text-xl mb-4">Transférer de l'argent de ce fond&nbsp;?</h2>
            <p className="text-gray-400">Sélectionnez un fond destinataire pour le transfert.</p>
            <form onSubmit={onSubmit}>
                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
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
                </fieldset>
                {errors.amount && <InputError message={errors.amount}/>}

                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
                    <label htmlFor="fonds">Vers quel fond</label>
                    <select
                        name="destinationFundId"
                        id="fonds"
                        className="rounded-md ml-3"
                        value={formData.destinationFundId}
                        onChange={handleInputChange}
                    >
                        <option value="">Sélectionnez un fond</option>
                        {funds
                            .filter((fund) => fund.id !== activeFundId)
                            .map((fund) => (
                                <option value={fund.id} key={fund.id}>
                                    {fund.name}
                                </option>
                            ))}
                    </select>
                </fieldset>
                {errors.destinationFundId && <InputError message={errors.destinationFundId}/>}

                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
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
                </fieldset>
                {errors.transactor && <InputError message={errors.transactor}/>}

                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
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
                </fieldset>
                {errors.communication && <InputError message={errors.communication}/>}

                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
                    <input
                        type="hidden"
                        name="date"
                        id="date"
                        className="rounded-md ml-3"
                        value={formData.date}
                        onChange={handleInputChange}
                    />
                </fieldset>
                {errors.date && <InputError message={errors.date}/>}

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
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-white hover:text-green-500 border border-1 border-green-500"
                    >
                        Transférer
                    </button>
                </div>
            </form>
        </div>
    );
}
