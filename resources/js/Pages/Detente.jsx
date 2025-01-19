import MainStructure from "@/Components/MainStructure.jsx";
import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import {Link, router, usePage} from '@inertiajs/react';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import React from "react";

export default function Detente() {
    const {transactions} = usePage().props;

    const handleSubmit = (donatorId, name) => {
        router.post(route('detente.store'), {
            name: name,
            donator_id: donatorId,
            participation: 0
        });
        console.log('Envoyer le donator_id et participation:', donatorId, 0);
    };


    return (
        <MainStructure pageTitle={'Détente'}>
            <div className="flex-grow p-3 flex flex-col items-center">
                <section className="w-full">
                    <TitleAndSpan title="Détente"/>
                </section>
                <div className="flex items-center gap-4 w-full justify-center mt-4">
                    <h4>Personnes éligibles</h4>
                    <span className="block h-0.5 bg-gray-300 mt-1.5 ml-2 flex-grow"/>
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
                                        <input type="hidden" name="donator_id" value={transaction.donator_id}/>
                                        <input type="hidden" name="participation" value="0"/>
                                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Ajouter</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <Link href='/draw' className="mt-4 bg-black text-white p-1 lg:p-2 rounded hover:bg-white hover:text-black border border-black
                                   text-xs lg:text-base">
                    Accéder au tirage
                </Link>
            </div>
        </MainStructure>
    );
}
