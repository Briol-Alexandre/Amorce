import React from 'react';
import Widget from './Widget';
import { router } from '@inertiajs/react';
import FondIcon from '@/Components/icons/FondIcon.jsx';

/**
 * 
 * @param {Object} props 
 * @param {Array} props.funds 
 * @param {number} props.totalAmount 
 * @param {number} props.fundCount 
 * @returns {JSX.Element}
 */
export default function FundsWidget({ funds, totalAmount, fundCount }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    return (
        <Widget
            title="Fonds"
            color=""
            icon={<FondIcon className="w-5 h-5 inline" />}
            className="h-full"
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500">Montant total</p>
                        <p className="text-xl font-bold text-gray-700">{formatCurrency(totalAmount)}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500">Nombre de fonds</p>
                        <p className="text-xl font-bold text-gray-700">{fundCount}</p>
                    </div>
                </div>

                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Fonds récents</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {funds.slice(0, 5).map((fund) => (
                            <div
                                key={fund.id}
                                className="p-2 bg-white rounded border border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                                onClick={() => router.visit(route('fond.show', fund.id))}
                            >
                                <span className="font-medium">{fund.name}</span>
                                <span className="text-gray-700 font-medium">{formatCurrency(fund.amount)}</span>
                            </div>
                        ))}
                    </div>


                    <div className="mt-3 text-center">
                        <button
                            onClick={() => router.visit(route('fond.index'))}
                            className="text-sm text-gray-600 hover:text-gray-800"
                        >
                            Voir tous les fonds
                        </button>
                    </div>

                </div>
            </div>
        </Widget>
    );
}
