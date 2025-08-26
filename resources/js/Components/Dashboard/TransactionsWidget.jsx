import React from 'react';
import Widget from './Widget';
import { router } from '@inertiajs/react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';


export default function TransactionsWidget({ transactions }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'short'
        }).format(date);
    };

    return (
        <Widget
            title="Transactions récentes"
            color=""
            icon={<ArrowPathIcon className="w-5 h-5 inline" />}
            className="h-full"
        >
            <div className="space-y-4">
                {transactions.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {transactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="p-2 bg-white rounded border border-gray-100 flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-medium text-gray-800 truncate max-w-[150px]">
                                        →
                                        {transaction.fund?.name || 'Anonyme'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                        {formatDate(transaction.created_at)}
                                    </p>
                                </div>
                                <span className={`font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(transaction.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">Aucune transaction récente</p>
                )}

                <div className="mt-3 text-center">
                    <button
                        onClick={() => router.visit(route('transactions.index'))}
                        className="text-sm text-gray-600 hover:text-gray-800"
                    >
                        Voir toutes les transactions
                    </button>
                </div>
            </div>
        </Widget>
    );
}
