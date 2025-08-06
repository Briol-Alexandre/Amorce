import MainStructure from "@/Components/MainStructure.jsx";
import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import { Link, router, usePage } from '@inertiajs/react';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import React, { useState, useEffect } from "react";

export default function Detente() {
    const { transactions, drawParticipantsCount, flash } = usePage().props;
    const [selectedDonators, setSelectedDonators] = useState([]);

    const handleCheckboxChange = (donatorId, name, isChecked) => {
        if (isChecked) {
            setSelectedDonators([...selectedDonators, { id: donatorId, name }]);
        } else {
            setSelectedDonators(selectedDonators.filter(donator => donator.id !== donatorId));
        }
    };

    const handleSubmitSelected = () => {
        selectedDonators.forEach((donator, index) => {
            if (index === selectedDonators.length - 1) {
                router.post(route('detente.store'), {
                    name: donator.name,
                    donator_id: donator.id,
                    participation: 0
                }, {
                    onSuccess: () => {
                        router.visit(route('detente.draw'));
                    }
                });
            } else {
                router.post(route('detente.store'), {
                    name: donator.name,
                    donator_id: donator.id,
                    participation: 0
                });
            }
        });

        setSelectedDonators([]);
    };


    return (
        <MainStructure pageTitle={'Détente'}>
            <div className="flex-grow p-3 flex flex-col items-center">
                <section className="w-full">
                    <TitleAndSpan title="Détente" />
                </section>

                <div className="flex items-center gap-4 w-full justify-center mt-4">
                    <h4>Personnes éligibles</h4>
                    <span className="block h-0.5 bg-gray-300 mt-1.5 ml-2 flex-grow" />
                </div>
                <div className="w-full overflow-x-auto mt-4">
                    <table className="border-collapse border border-gray-300 mx-auto w-3/4 text-center">
                        <thead>
                            <tr>
                                <th className="border border-gray-400 p-2 w-1/5">Personnes</th>
                                <th className="border border-gray-400 p-2 w-1/5">Dons les 3 derniers mois</th>
                                <th className="border border-gray-400 p-2 w-1/5">Ne fait pas partie de l'actuelle détente</th>
                                <th className="border border-gray-400 p-2 w-1/5">Dernière détente + de 1 an</th>
                                <th className="border border-gray-400 p-2 w-1/5">Ajouter au tirage ?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-400 p-2">{transaction.name}</td>
                                    <td className={`border border-gray-400 p-2 ${transaction.has_recent_donations ? 'bg-green-300/20' : 'bg-red-300/20'}`}>
                                        <span className="inline-block px-2 py-1 font-medium">
                                            {transaction.has_recent_donations ? "Oui" : "Non"}
                                        </span>
                                    </td>
                                    <td className={`border border-gray-400 p-2 ${transaction.not_in_detente ? 'bg-green-300/20' : 'bg-red-300/20'}`}>
                                        <span className="inline-block px-2 py-1 font-medium">
                                            {transaction.not_in_detente ? "Oui" : "Non"}
                                        </span>
                                    </td>
                                    <td className={`border border-gray-400 p-2 ${transaction.last_detente_over_year ? 'bg-green-300/20' : 'bg-red-300/20'}`}>
                                        <span className="inline-block px-2 py-1 font-medium">
                                            {transaction.last_detente_over_year ? "Oui" : "Non"}
                                        </span>
                                    </td>
                                    <td className="border border-gray-400 p-2">
                                        <div className="flex justify-center items-center">
                                            <input
                                                type="checkbox"
                                                id={`donator-${transaction.donator_id}`}
                                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                                onChange={(e) => handleCheckboxChange(transaction.donator_id, transaction.name, e.target.checked)}
                                                checked={selectedDonators.some(donator => donator.id === transaction.donator_id)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedDonators.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 flex justify-between items-center">
                    <div className="text-gray-800 font-medium">
                        <span className="mr-2">{selectedDonators.length}</span>
                        {selectedDonators.length === 1 ? 'personne sélectionnée' : 'personnes sélectionnées'}
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setSelectedDonators([])}
                            className="text-gray-600 hover:text-gray-800 underline"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSubmitSelected}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm lg:text-base font-medium"
                        >
                            Ajouter au tirage et continuer
                        </button>
                    </div>
                </div>
            )}
        </MainStructure>
    );
}
