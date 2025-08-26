import React, { useState } from "react";
import InputError from "@/Components/InputError.jsx";

export function ModalTransferBeforeDelete({ closeModal, handleTransferAndDelete, fund, funds }) {
    const activeFundId = fund.id;
    const currentDate = new Date().toISOString().split('T')[0];

    // État pour gérer les transferts multiples
    const [transfers, setTransfers] = useState([
        {
            id: 1,
            amount: "",
            destinationFundId: "",
            communication: `Transfert avant suppression du fond ${fund.name}`,
            date: currentDate,
        }
    ]);

    const [errors, setErrors] = useState({});
    const [nextId, setNextId] = useState(2);

    // Fonction pour gérer les changements dans un transfert spécifique
    const handleTransferChange = (transferId, field, value) => {
        setTransfers(prevTransfers =>
            prevTransfers.map(transfer =>
                transfer.id === transferId
                    ? { ...transfer, [field]: value }
                    : transfer
            )
        );

        // Effacer l'erreur pour ce champ spécifique
        setErrors(prevErrors => ({
            ...prevErrors,
            [`${transferId}_${field}`]: "",
        }));
    };

    // Ajouter un nouveau transfert
    const addTransfer = () => {
        const newTransfer = {
            id: nextId,
            amount: "",
            destinationFundId: "",
            communication: `Transfert avant suppression du fond ${fund.name}`,
            date: currentDate,
        };
        setTransfers(prev => [...prev, newTransfer]);
        setNextId(prev => prev + 1);
    };

    // Supprimer un transfert
    const removeTransfer = (transferId) => {
        if (transfers.length > 1) {
            setTransfers(prev => prev.filter(transfer => transfer.id !== transferId));
            // Nettoyer les erreurs associées
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                Object.keys(newErrors).forEach(key => {
                    if (key.startsWith(`${transferId}_`)) {
                        delete newErrors[key];
                    }
                });
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        let formErrors = {};
        let totalAmount = 0;

        // Valider chaque transfert
        transfers.forEach(transfer => {
            const amount = parseFloat(transfer.amount);

            if (!transfer.amount || isNaN(amount) || amount <= 0) {
                formErrors[`${transfer.id}_amount`] = "Le montant est requis et doit être un nombre valide supérieur à 0.";
            } else {
                totalAmount += amount;
            }

            if (!transfer.destinationFundId) {
                formErrors[`${transfer.id}_destinationFundId`] = "Veuillez sélectionner un fond destinataire.";
            }


            if (!transfer.communication) {
                formErrors[`${transfer.id}_communication`] = "La communication est requise.";
            }
        });

        // Vérifier que le total des montants correspond au montant du fond
        if (totalAmount !== fund.amount) {
            formErrors.totalAmount = `Le total des transferts (${totalAmount}€) doit égaler le montant du fond (${fund.amount}€).`;
        }

        // Pas de vérification de doublons - on peut transférer plusieurs fois vers le même fond

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Préparer les données de transferts multiples
            const transfersData = transfers.map(transfer => ({
                amount: parseFloat(transfer.amount),
                fund_id: fund.id,
                destinationFundId: transfer.destinationFundId,
                communication: transfer.communication,
                date: transfer.date,
            }));

            handleTransferAndDelete(transfersData);
        }
    };

    // Calculer le montant restant à répartir
    const totalAllocated = transfers.reduce((sum, transfer) => {
        const amount = parseFloat(transfer.amount) || 0;
        return sum + amount;
    }, 0);
    const remainingAmount = fund.amount - totalAllocated;

    return (
        <div className="max-w-4xl max-lg:w-full">
            <h2 className="lg:text-xl max-lg:text-lg max-lg:font-semibold max-lg:mt-2 mb-2 lg:mb-4">Répartir l'argent avant suppression</h2>
            <div className="mb-4">
                <p className="text-gray-400 max-lg:text-sm max-lg:mt-1">
                    Ce fond contient <strong>{fund.amount}€</strong>. Vous devez répartir cet argent vers un ou plusieurs autres fonds.
                </p>
                <p className="text-sm max-lg:text-xs mt-2">
                    <span className={remainingAmount === 0 ? 'text-green-600' : 'text-orange-600'}>
                        Restant à répartir : <strong>{remainingAmount}€</strong>
                    </span>
                </p>
            </div>

            <form onSubmit={onSubmit}>
                {/* Erreurs globales */}
                {errors.totalAmount && <InputError message={errors.totalAmount} />}

                {/* Liste des transferts */}
                <div className="space-y-6">
                    {transfers.map((transfer, index) => (
                        <div key={transfer.id} className="border rounded-lg lg:p-4 max-lg:p-3 bg-gray-50">
                            <div className="flex justify-between items-center mb-2 lg:mb-3">
                                <h3 className="font-medium lg:text-base max-lg:text-sm">Transfert {index + 1}</h3>
                                {transfers.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeTransfer(transfer.id)}
                                        className="text-red-500 hover:text-red-700 text-sm max-lg:text-xs"
                                    >
                                        × Supprimer
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-lg:gap-2">
                                <div>
                                    <label className="block text-sm max-lg:text-xs font-medium mb-1">Montant</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max={fund.amount}
                                        className="w-full rounded-md border-gray-300"
                                        value={transfer.amount}
                                        placeholder="0.00"
                                        onChange={(e) => handleTransferChange(transfer.id, 'amount', e.target.value)}
                                    />
                                    {errors[`${transfer.id}_amount`] && <InputError message={errors[`${transfer.id}_amount`]} />}
                                </div>

                                <div>
                                    <label className="block text-sm max-lg:text-xs font-medium mb-1">Vers quel fond</label>
                                    <select
                                        className="w-full rounded-md border-gray-300 text-ellipsis overflow-hidden"
                                        value={transfer.destinationFundId}
                                        onChange={(e) => handleTransferChange(transfer.id, 'destinationFundId', e.target.value)}
                                        style={{ maxWidth: '100%' }}
                                    >
                                        <option value="">Sélectionnez un fond</option>
                                        {funds
                                            .filter((f) => f.id !== activeFundId)
                                            .map((f) => (
                                                <option value={f.id} key={f.id} title={`${f.name} (${f.amount}€)`} className="text-ellipsis overflow-hidden">
                                                    {f.name} ({f.amount}€)
                                                </option>
                                            ))}
                                    </select>
                                    {errors[`${transfer.id}_destinationFundId`] && <InputError message={errors[`${transfer.id}_destinationFundId`]} />}
                                </div>


                                <div>
                                    <label className="block text-sm max-lg:text-xs font-medium mb-1">Communication</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border-gray-300"
                                        value={transfer.communication}
                                        placeholder="Communication"
                                        onChange={(e) => handleTransferChange(transfer.id, 'communication', e.target.value)}
                                    />
                                    {errors[`${transfer.id}_communication`] && <InputError message={errors[`${transfer.id}_communication`]} />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bouton pour ajouter un transfert */}
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={addTransfer}
                        className="text-blue-500 hover:text-blue-700 text-sm max-lg:text-xs font-medium"
                    >
                        + Ajouter un autre transfert
                    </button>
                </div>

                <div className="flex justify-end mt-6 lg:mt-8 lg:gap-4 max-lg:gap-2">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="bg-gray-300 text-gray-700 lg:px-4 lg:py-2 max-lg:px-2 max-lg:py-1 max-lg:text-sm rounded-md hover:bg-gray-400"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="bg-red-500 text-white lg:px-4 lg:py-2 max-lg:px-2 max-lg:py-1 max-lg:text-sm rounded-md hover:bg-white hover:text-red-500 border border-1 border-red-500"
                        disabled={remainingAmount !== 0}
                    >
                        Répartir et Supprimer
                    </button>
                </div>
            </form>
        </div>
    );
}
