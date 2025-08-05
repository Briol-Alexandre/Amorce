import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import MainStructure from "@/Components/MainStructure.jsx";
import ActionButton from "@/Components/ActionButton.jsx";
import React, { useState } from 'react';
import { usePage, Link } from "@inertiajs/react";

export default function CsvError() {
    const { error, message, duplicates, totalTransactions } = usePage().props;

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(duplicates.length / itemsPerPage);

    const currentDuplicates = duplicates.slice(
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
        <>
            <MainStructure pageTitle='Erreur CSV'>
                <div className='w-full'>
                    <div className='flex flex-col w-full'>
                        <div className="p-3">
                            <TitleAndSpan title='Import CSV bloqué' />
                        </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-md p-6 mb-6">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-red-800">
                                    {error}
                                </h3>
                                <p className="text-red-700 mt-1">
                                    {message}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-md p-4 border border-red-200">
                            <h4 className="font-semibold text-red-800 mb-3">
                                Statistiques de l'import :
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">Total transactions :</span>
                                    <span className="ml-2">{totalTransactions}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-red-600">Doublons détectés :</span>
                                    <span className="ml-2 text-red-600 font-bold">{duplicates.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {duplicates && duplicates.length > 0 && (
                        <div className="bg-white rounded-md border border-gray-200 mb-6">
                            <div className="px-4 py-3 border-b border-gray-200">
                                <h4 className="font-semibold text-gray-800">
                                    Transactions en doublon détectées :
                                </h4>
                            </div>
                            <div className="px-6 mt-4">
                                <ul>
                                    <li className="grid grid-cols-5 items-center mb-6 border-b-2 border-gray-400 pb-4">
                                        <span className="font-bold">Ligne CSV</span>
                                        <span className="font-bold">Date</span>
                                        <span className="text-center font-bold">Montant</span>
                                        <span className="font-bold">Transacteur</span>
                                        <span className="text-right font-bold">ID Existant</span>
                                    </li>
                                    {currentDuplicates.map((duplicate, index) => (
                                        <li
                                            key={index}
                                            className="grid grid-cols-5 items-center border-b-2 border-gray-200 mb-4 pb-4 last-of-type:border-none"
                                        >
                                            <span className="text-sm font-medium text-red-600">#{duplicate.index}</span>
                                            <span className="text-sm">{duplicate.date}</span>
                                            <span className="text-center text-sm font-medium">
                                                {duplicate.amount}€
                                            </span>
                                            <span className="text-sm truncate max-w-xs" title={duplicate.transactor}>
                                                {duplicate.transactor}
                                            </span>
                                            <span className="text-right text-sm text-gray-500">
                                                #{duplicate.existing_id}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-between items-center mt-4 space-x-2">
                                        <button
                                            className={`px-4 py-2 bg-gray-200 rounded ${
                                                currentPage === 1 && "opacity-50 cursor-not-allowed"
                                            }`}
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Précédent
                                        </button>
                                        <div className="flex gap-2">
                                            {getPages().map((page, index) => (
                                                <button
                                                    key={index}
                                                    className={`px-4 py-2 bg-gray-200 rounded ${
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
                                            className={`px-4 py-2 bg-gray-200 rounded ${
                                                currentPage === totalPages && "opacity-50 cursor-not-allowed"
                                            }`}
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Suivant
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center space-x-4">
                        <Link href="/csv" className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors">
                            Retour à l'import
                        </Link>
                        <Link href="/fonds" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
                            Voir les fonds
                        </Link>
                    </div>
                </div>
            </MainStructure>
        </>
    );
}
