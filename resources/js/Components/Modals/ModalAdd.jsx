import React, { useState } from "react";
import InputError from "@/Components/InputError.jsx";
import { router } from "@inertiajs/react";

export function ModalAdd({ closeModal, handleAdd, fund }) {
    const [addMethod, setAddMethod] = useState("manual"); // "manual" ou "csv"
    const [formData, setFormData] = useState({
        amount: "",
        date: "",
        transactor: "",
        communication: "",
        fund_id: fund.id,
    });
    const [csvFile, setCsvFile] = useState(null);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };
    
    const handleFileChange = (e) => {
        setCsvFile(e.target.files[0]);
    };
    
    const handleMethodChange = (method) => {
        setAddMethod(method);
        // Réinitialiser les erreurs lors du changement de méthode
        setErrors({});
    };
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

        return Object.keys(formErrors).length === 0;
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (addMethod === "manual") {
            if (validateForm()) {
                handleAdd(formData);
                closeModal();
            }
        } else if (addMethod === "csv") {
            if (csvFile) {
                const data = new FormData();
                data.append('csv', csvFile);
                
                // Utiliser la route pour importer le CSV
                router.post(route('transaction.seed-csv-transactions'), data, {
                    forceFormData: true,
                    onSuccess: () => {
                        closeModal();
                    },
                    onError: (errors) => {
                        console.error('Erreur lors de l\'import CSV:', errors);
                        setErrors({csv: 'Erreur lors de l\'import du fichier CSV'});
                    },
                });
            } else {
                setErrors({csv: 'Veuillez sélectionner un fichier CSV'});
            }
        }
    };

    return (
        <div>
            <h2 className="text-xl">Voulez-vous ajouter de l'argent à ce fond&nbsp;?</h2>
            <p className="text-gray-400">Choisissez une méthode d'ajout.</p>
            
            <div className="flex space-x-4 mt-4 mb-6">
                <button 
                    type="button" 
                    onClick={() => handleMethodChange("manual")} 
                    className={`px-4 py-2 rounded-md ${addMethod === "manual" 
                        ? "bg-blue-500 text-white" 
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                >
                    Ajouter manuellement
                </button>
                <button 
                    type="button" 
                    onClick={() => handleMethodChange("csv")} 
                    className={`px-4 py-2 rounded-md ${addMethod === "csv" 
                        ? "bg-blue-500 text-white" 
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                >
                    Importer depuis un CSV
                </button>
            </div>
            
            <form onSubmit={onSubmit}>
                {addMethod === "manual" && (
                    <>
                        <input
                            type="hidden"
                            name="fund_id"
                            value={formData.fund_id}
                        />
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
                        {errors.amount && <InputError message={errors.amount} />}
                        <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
                            <label htmlFor="date">Date</label>
                            <input
                                type="date"
                                name="date"
                                id="date"
                                className="rounded-md ml-3"
                                value={formData.date}
                                onChange={handleInputChange}
                            />
                        </fieldset>
                        {errors.date && <InputError message={errors.date} />}
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
                        {errors.transactor && <InputError message={errors.transactor} />}
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
                        {errors.communication && <InputError message={errors.communication} />}
                    </>
                )}
                
                {addMethod === "csv" && (
                    <>
                        <p className="text-gray-600 mb-4">Déposez le fichier CSV contenant les transactions à importer.</p>
                        <fieldset className="mt-5 self-end grid grid-row-[1fr_3fr] gap-2 items-center">
                            <label htmlFor="csv">Fichier CSV</label>
                            <input
                                type="file"
                                name="csv"
                                id="csv"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="border p-2 rounded-md w-full"
                            />
                        </fieldset>
                        {errors.csv && <InputError message={errors.csv} />}
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-700">
                                <strong>Note:</strong> Le système vérifiera automatiquement les doublons pour éviter la duplication d'argent.
                            </p>
                        </div>
                    </>
                )}
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
                        {addMethod === "manual" ? "Ajouter" : "Importer"}
                    </button>
                </div>
            </form>
        </div>
    );
}
