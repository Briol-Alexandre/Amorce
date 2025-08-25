import React, { useState } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import MainStructure from "@/Components/MainStructure.jsx";
import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function DetenteHistory() {
    const { participationsHistory, flash } = usePage().props;
    
    // Pagination
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    
    const totalPages = Math.ceil(participationsHistory.length / itemsPerPage);
    
    const currentParticipations = participationsHistory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    const getPages = () => {
        const pages = [];
        const maxPagesToShow = 7;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) pages.push('...');
            const start = Math.max(currentPage - 1, 2);
            const end = Math.min(currentPage + 1, totalPages - 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) pages.push('...');
            if (totalPages > 1) pages.push(totalPages);
        }

        return pages;
    };

    return (
        <MainStructure pageTitle={'Historique des participations'}>
            <section className={"flex-grow lg:p-3 py-3"}>
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
                <div className="flex lg:flex-row max-lg:flex-col max-lg:gap-4 justify-between items-center mt-4 lg:mx-8 max-lg:mx-2 mb-6">
                    <div className="text-gray-700 max-lg:text-sm">
                        <span className="font-medium">{participationsHistory.length}</span> participant(s) dans l'historique
                    </div>
                    <div className="lg:space-x-4 max-lg:flex max-lg:flex-col max-lg:gap-2 max-lg:w-full">
                        <Link 
                            href={route('detente.index')} 
                            className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 max-lg:w-full max-lg:text-center max-lg:text-sm'
                        >
                            Page Détente
                        </Link>
                        
                        <Link 
                            href={route('detente.draw')} 
                            className='bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 max-lg:w-full max-lg:text-center max-lg:text-sm'
                        >
                            Page Tirage
                        </Link>
                    </div>
                </div>
                
                {/* Section de l'historique des participations */}
                <section className="mb-8 lg:mx-8 max-lg:mx-2">
                    <div className='flex items-center gap-4'>
                        <h4 className='text-sm lg:text-base'>Historique des participations à la détente</h4>
                        <span className="block h-0.5 bg-gray-300 mt-1.5 ml-2 flex-grow"></span>
                    </div>
                    
                    {participationsHistory.length === 0 ? (
                        <p className="text-center m-4 font-bold max-lg:text-sm">
                            Aucun historique de participation disponible.
                        </p>
                    ) : (
                        <div className="px-6 mt-4">
                            <ul>
                                <li className="grid grid-cols-3 items-center mb-6 border-b-2 border-gray-400 pb-4 max-lg:text-sm">
                                    <span className="font-bold">Nom</span>
                                    <span className="text-center font-bold">ID Donateur</span>
                                    <span className="text-right font-bold">Dernière détente</span>
                                </li>
                                {currentParticipations.map((participation) => (
                                    <li
                                        key={participation.id}
                                        className="grid grid-cols-3 items-center border-b-2 border-gray-200 mb-4 pb-4 last-of-type:border-none max-lg:text-xs"
                                    >
                                        <span>{participation.name}</span>
                                        <span className="text-center">{participation.user_id}</span>
                                        <span className="text-right">
                                            {format(new Date(participation.last_detente), "dd MMMM yyyy à HH:mm", { locale: fr })}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* Pagination */}
                            <div className="flex lg:flex-row max-lg:flex-col max-lg:gap-4 justify-between items-center mt-4 lg:space-x-2">
                                <button
                                    className={`px-4 py-2 bg-gray-200 rounded max-lg:w-full max-lg:text-sm ${
                                        currentPage === 1 && "opacity-50 cursor-not-allowed"
                                    }`}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Précédent
                                </button>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {getPages().map((page, index) => (
                                        <button
                                            key={index}
                                            className={`px-4 py-2 bg-gray-200 rounded max-lg:text-xs ${
                                                page === currentPage
                                                    ? "bg-gray-900 text-white"
                                                    : "text-gray-700"
                                            }`}
                                            onClick={() => {
                                                if (page !== '...') {
                                                    handlePageChange(page);
                                                }
                                            }}
                                            disabled={page === '...'}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    className={`px-4 py-2 bg-gray-200 rounded max-lg:w-full max-lg:text-sm ${
                                        currentPage === totalPages && "opacity-50 cursor-not-allowed"
                                    }`}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Suivant
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </section>
        </MainStructure>
    );
}
