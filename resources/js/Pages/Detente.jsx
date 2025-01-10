import MainStructure from "@/Components/MainStructure.jsx";
import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import {usePage} from '@inertiajs/react';

export default function Detente() {
    const {transactions} = usePage().props;

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
                            <th className="border border-gray-400 p-2 w-1/5">Ajouter à la détente</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((transaction, index) => (
                            <tr key={index}>
                                <td className="border border-gray-400 p-2">{transaction.transactor}</td>
                                <td className="border border-gray-400 p-2 bg-gray-200">Oui</td>
                                <td className="border border-gray-400 p-2 bg-gray-200">Oui</td>
                                <td className="border border-gray-400 p-2 bg-gray-200">Oui</td>
                                <td className="border border-gray-400 p-2"><input type="checkbox"/></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </MainStructure>
    );
}
