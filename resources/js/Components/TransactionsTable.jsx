import React, {useState} from "react";
import {format} from "date-fns";

export function TransactionsTable({transactions}) {
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(transactions.length / itemsPerPage);

    const currentTransactions = transactions.slice(
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
            {transactions.length === 0 ? (
                <p className="text-center m-4 font-bold">
                    Ce fond n'a pas encore de transactions.
                </p>
            ) : (
                <div className="px-6 mt-4">
                    <ul>
                        <li className="grid grid-cols-3 items-center mb-6 border-b-2 border-gray-400 pb-4">
                            <span className="font-bold">Date</span>
                            <span className="text-center font-bold">Montant</span>
                            <span className="text-right font-bold">Communication</span>
                        </li>
                        {currentTransactions.map((transaction) => (
                            <li
                                key={transaction.id}
                                className="grid grid-cols-3 items-center border-b-2 border-gray-200 mb-4 pb-4 last-of-type:border-none"
                            >
                                <span>{format(new Date(transaction.date), "MM-yyyy")}</span>
                                <span
                                    className={
                                        transaction.amount > 0
                                            ? "text-green-600 text-center"
                                            : "text-red-600 text-center"
                                    }
                                >
                                    {transaction.amount}&nbsp;€
                                </span>
                                <span className="text-right">{transaction.communication}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Pagination */}
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
                </div>
            )}
        </>
    );
}
