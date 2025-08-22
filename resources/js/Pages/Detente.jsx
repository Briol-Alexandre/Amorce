import MainStructure from "@/Components/MainStructure.jsx";
import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import { router, usePage } from '@inertiajs/react';
import React, { useState } from "react";

export default function Detente() {
    const { transactions } = usePage().props;
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
            <div className="flex-grow lg:p-3 py-2 flex flex-col items-center">
                <section className="w-full">
                    <TitleAndSpan title="Détente" />
                </section>

                <div className="flex items-center gap-4 w-full justify-center mt-4 lg:pl-4">
                    <h4>Personnes éligibles</h4>
                    <span className="block h-0.5 bg-gray-300 mt-1.5 ml-2 flex-grow" />
                </div>
                <p className="lg:font-bold py-5 max-lg:text-xs">Ici se trouvent les personnes éligibles à la prochaine détente. Veuillez cocher les personnes que vous souhaitez ajouter au tirage de la détente. </p>
                <div className="w-full overflow-x-auto mt-4">
                    <table className="border-collapse border border-gray-300 mx-auto lg:w-3/4 w-full text-center mb-20 max-lg:text-xs">
                        <thead>
                            <tr>
                                <th className="border border-gray-400 lg:p-2 p-1 w-1/5">Personnes</th>
                                <th className="border border-gray-400 lg:p-2 p-1 w-1/5 max-lg:whitespace-normal">Dons les 3 derniers mois</th>
                                <th className="border border-gray-400 lg:p-2 p-1 w-1/5 max-lg:whitespace-normal">Ne fait pas partie de l'actuelle détente</th>
                                <th className="border border-gray-400 lg:p-2 p-1 w-1/5 max-lg:whitespace-normal">Dernière détente + de 1 an</th>
                                <th className="border border-gray-400 lg:p-2 p-1 w-1/5">
                                    <span className="flex items-center justify-center max-lg:flex-col max-lg:gap-1">
                                        <span className="max-lg:whitespace-normal">Ajouter au tirage ?</span> <input type="checkbox" className="lg:w-5 lg:h-5 w-4 h-4 lg:ml-4 text-blue-600 rounded focus:ring-blue-500" onChange={(e) => e.target.checked ? setSelectedDonators(transactions.map(transaction => ({ id: transaction.donator_id, name: transaction.name }))) : setSelectedDonators([])} />
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-400 lg:p-2 p-1">{transaction.name}</td>
                                    <td className={`border border-gray-400 lg:p-2 p-1 ${transaction.has_recent_donations ? 'bg-green-300/20' : 'bg-red-300/20'}`}>
                                        <span className="inline-block lg:px-2 lg:py-1 px-1 py-0.5 font-medium">
                                            {transaction.has_recent_donations ? "Oui" : "Non"}
                                        </span>
                                    </td>
                                    <td className={`border border-gray-400 lg:p-2 p-1 ${transaction.not_in_detente ? 'bg-green-300/20' : 'bg-red-300/20'}`}>
                                        <span className="inline-block lg:px-2 lg:py-1 px-1 py-0.5 font-medium">
                                            {transaction.not_in_detente ? "Oui" : "Non"}
                                        </span>
                                    </td>
                                    <td className={`border border-gray-400 lg:p-2 p-1 ${transaction.last_detente_over_year ? 'bg-green-300/20' : 'bg-red-300/20'}`}>
                                        <span className="inline-block lg:px-2 lg:py-1 px-1 py-0.5 font-medium">
                                            {transaction.last_detente_over_year ? "Oui" : "Non"}
                                        </span>
                                    </td>
                                    <td className="border border-gray-400 lg:p-2 p-1">
                                        <div className="flex justify-center items-center">
                                            <input
                                                type="checkbox"
                                                id={`donator-${transaction.donator_id}`}
                                                className="lg:w-5 lg:h-5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
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
                <div className="fixed bottom-0 z-50 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 flex justify-center items-center">
                    <div className="text-gray-800 font-medium flex-1 text-center">
                        <span className="mr-2">{selectedDonators.length}</span>
                        {selectedDonators.length === 1 ? 'personne sélectionnée' : 'personnes sélectionnées'}
                    </div>
                    <div className="absolute right-4 space-x-4">
                        <button
                            onClick={handleSubmitSelected}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm lg:text-base font-medium"
                        >
                            Ajouter et accéder au tirage
                        </button>
                    </div>
                </div>
            )}
        </MainStructure>
    );
}
