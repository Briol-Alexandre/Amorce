import React, {useState} from "react";
import InputError from "@/Components/InputError.jsx";

export function ModalTransfer({closeModal, handleTransfer, fund, funds}) {
    const activeFundId = fund.id;

    const currentDate = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        amount: "",
        fund_id: fund.id,
        destinationFundId: "",
        transactor: fund.name, // Pré-remplir avec le nom du fond source
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

        // Le transacteur est toujours défini, pas besoin de validation

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
            <h2 className="lg:text-xl max-lg:text-lg max-lg:font-semibold max-lg:mt-2 mb-2 lg:mb-4">Transférer de l'argent de ce fond&nbsp;?</h2>
            <p className="text-gray-400 max-lg:text-sm max-lg:mt-1">Sélectionnez un fond destinataire pour le transfert.</p>
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
                {errors.amount && <InputError message={errors.amount}/>}

                <fieldset className="mt-3 self-end grid lg:grid-cols-[1fr_3fr] max-lg:grid-cols-1 items-center">
                    <label htmlFor="fonds" className="max-lg:text-sm">Vers quel fond</label>
                    <select
                        name="destinationFundId"
                        id="fonds"
                        className="rounded-md lg:ml-3 max-lg:mt-1 w-full text-ellipsis overflow-hidden"
                        value={formData.destinationFundId}
                        onChange={handleInputChange}
                        style={{ maxWidth: '100%' }}
                    >
                        <option value="">Sélectionnez un fond</option>
                        {funds
                            .filter((fund) => fund.id !== activeFundId)
                            .map((fund) => (
                                <option value={fund.id} key={fund.id} title={fund.name} className="text-ellipsis overflow-hidden">
                                    {fund.name}
                                </option>
                            ))}
                    </select>
                </fieldset>
                {errors.destinationFundId && <InputError message={errors.destinationFundId}/>}

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
                {errors.communication && <InputError message={errors.communication}/>}

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
                {errors.date && <InputError message={errors.date}/>}

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
                        className="bg-green-500 text-white lg:px-4 lg:py-2 max-lg:px-2 max-lg:py-1 max-lg:text-sm rounded-md hover:bg-white hover:text-green-500 border border-1 border-green-500"
                    >
                        Transférer
                    </button>
                </div>
            </form>
        </div>
    );
}
