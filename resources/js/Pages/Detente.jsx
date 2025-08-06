import MainStructure from "@/Components/MainStructure.jsx";
import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import { Link, router, usePage } from '@inertiajs/react';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import React from "react";

export default function Detente() {
    const { transactions, drawParticipantsCount, flash } = usePage().props;

    const handleSubmit = (donatorId, name) => {
        router.post(route('detente.store'), {
            name: name,
            donator_id: donatorId,
            participation: 0
        });
    };


    return (
        <MainStructure pageTitle={'Détente'}>
            <div className="flex-grow p-3 flex flex-col items-center">
                <section className="w-full">
                    <TitleAndSpan title="Détente" />
                </section>
                
                {/* Messages flash */}
                {flash && flash.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 w-3/4">
                        {flash.success}
                    </div>
                )}
                
                {flash && flash.error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-3/4">
                        {flash.error}
                    </div>
                )}
                
                {/* Informations sur le tirage */}
                <div className="w-3/4 flex justify-between items-center mb-4">
                    <div className="text-gray-700">
                        <span className="font-medium">{transactions.length}</span> donateur(s) éligible(s)
                    </div>
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded">
                        <span className="font-medium">{drawParticipantsCount}</span> participant(s) dans le tirage
                    </div>
                </div>
                
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
                                    <td className="border border-gray-400 p-2 bg-gray-200">Oui</td>
                                    <td className="border border-gray-400 p-2 bg-gray-200">Oui</td>
                                    <td className="border border-gray-400 p-2 bg-gray-200">Oui</td>
                                    <td className="border border-gray-400 p-2">
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSubmit(transaction.donator_id, transaction.name);
                                        }}>
                                            <input type="hidden" name="donator_id" value={transaction.donator_id} />
                                            <input type="hidden" name="participation" value="0" />
                                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Ajouter</button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex space-x-4 mt-6">
                    <Link 
                        href={route('detente.draw')} 
                        className="bg-green-600 text-white p-2 lg:p-3 rounded hover:bg-green-700 text-sm lg:text-base font-medium"
                    >
                        Accéder au tirage ({drawParticipantsCount})
                    </Link>
                    
                    <Link 
                        href={route('detente.history')} 
                        className="bg-purple-600 text-white p-2 lg:p-3 rounded hover:bg-purple-700 text-sm lg:text-base font-medium"
                    >
                        Voir l'historique
                    </Link>
                    
                    <Link 
                        href={route('detente.index') + '?refresh=true'} 
                        className="bg-blue-600 text-white p-2 lg:p-3 rounded hover:bg-blue-700 text-sm lg:text-base font-medium"
                    >
                        Rafraîchir la liste des éligibles
                    </Link>
                </div>
            </div>
        </MainStructure>
    );
}
