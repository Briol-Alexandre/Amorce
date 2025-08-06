import React from "react";
import { router, usePage, Link } from "@inertiajs/react";
import MainStructure from "@/Components/MainStructure.jsx";
import TitleAndSpan from "@/Components/TitleAndSpan.jsx";

export default function DetenteHistory() {
    const { participationsHistory, flash } = usePage().props;

    return (
        <MainStructure pageTitle={'Historique des participations'}>
            <section className={"flex-grow p-3"}>
                <TitleAndSpan onClick={() => router.visit(route('detente.history'))} title={'Historique des participations'} />
                
                {/* Messages flash */}
                {flash && flash.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 mx-8">
                        {flash.success}
                    </div>
                )}
                
                {flash && flash.error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mx-8">
                        {flash.error}
                    </div>
                )}
                
                {/* Navigation */}
                <div className="flex justify-between items-center mt-4 mx-8 mb-6">
                    <div className="text-gray-700">
                        <span className="font-medium">{participationsHistory.length}</span> participant(s) dans l'historique
                    </div>
                    <div className="space-x-4">
                        <Link 
                            href={route('detente.index')} 
                            className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'
                        >
                            Page Détente
                        </Link>
                        
                        <Link 
                            href={route('detente.draw')} 
                            className='bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700'
                        >
                            Page Tirage
                        </Link>
                    </div>
                </div>
                
                {/* Section de l'historique des participations */}
                <section className="mb-8 mx-8">
                    <h2 className="text-xl font-semibold mb-4">Historique des participations à la détente</h2>
                    {participationsHistory.length > 0 ? (
                        <div className='flex flex-col'>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 text-left font-medium text-gray-600">Nom</th>
                                            <th className="py-3 px-4 text-left font-medium text-gray-600">ID Donateur</th>
                                            <th className="py-3 px-4 text-left font-medium text-gray-600">Dernière détente</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {participationsHistory.map((participation) => (
                                            <tr key={participation.id} className="hover:bg-gray-50">
                                                <td className="py-3 px-4">{participation.name}</td>
                                                <td className="py-3 px-4">{participation.user_id}</td>
                                                <td className="py-3 px-4">
                                                    {new Date(participation.last_detente).toLocaleDateString('fr-FR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">Aucun historique de participation disponible.</p>
                    )}
                </section>
            </section>
        </MainStructure>
    );
}
