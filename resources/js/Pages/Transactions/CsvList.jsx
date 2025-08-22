import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import MainStructure from "@/Components/MainStructure.jsx";
import ActionButton from "@/Components/ActionButton.jsx";
import React, { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";


export default function CsvList() {
    const { funds, transactions } = usePage().props;

    const [selectedFunds, setSelectedFunds] = useState([]);

    useEffect(() => {
        if (transactions && transactions.length > 0 && funds.length > 0) {
            setSelectedFunds(transactions.map((transaction) => {
                return transaction.fund_id || funds[0].id;
            }));
        }
    }, [transactions, funds]);


    function handleFundChange(e, index) {
        const updatedFunds = [...selectedFunds];
        updatedFunds[index] = e.target.value;
        setSelectedFunds(updatedFunds);
    }

    function submitCsv(e) {
        e.preventDefault();

        const formData = {
            transactions: transactions.map((transaction, index) => ({
                ...transaction,
                fund_id: parseInt(selectedFunds[index]),
            })),
        };

        console.log('Submitting CSV data:', formData);

        router.post('/csv/submit', formData, {
            forceFormData: true,
            onSuccess: () => {
            },
            onError: (errors) => {
                console.error('Erreur dans la requête :', errors);
            },
        });
    }

    return (
        <>
            <MainStructure pageTitle='Csv'>
                <div className='w-full'>
                    <div className='flex flex-col w-full'>
                        <div className="p-3 ">
                            <TitleAndSpan title='CSV' />
                        </div>
                    </div>
                    <form onSubmit={submitCsv}>
                        <div className="max-h-[80vh] overflow-y-auto bg-white px-4 rounded-md">
                            <div className="pb-4 sticky top-0 bg-white w-full">
                                <h2 className="text-xl font-bold ">Sélectionner un fond pour les
                                    transactions</h2>
                                <p className="text-gray-500 text-sm">Les fonds entourés de vert signifient que le fond a automatiquement été sélectionné car il correspondait aux informations du virement</p>
                            </div>
                            <div
                                className="grid grid-cols-[1fr_1fr_1fr_3fr_2fr] gap-4 bg-white p-4 rounded-md items-center">
                                <p className="font-bold text-left sticky top-14 pb-5 bg-white z-10">Id</p>
                                <p className="font-bold text-left sticky top-14 pb-5 bg-white z-10">Date</p>
                                <p className="font-bold text-left sticky top-14 pb-5 bg-white z-10">Montant</p>
                                <p className="font-bold text-left sticky top-14 pb-5 bg-white z-10">Communication</p>
                                <p className="font-bold text-left sticky top-14 pb-5 bg-white z-10">Fonds</p>
                                {Array.isArray(transactions) && transactions.map((transaction, index) => (
                                    <React.Fragment key={index}>
                                        <p>{index + 1}</p>
                                        <p className="py-2">{transaction.date}</p>
                                        <p className="py-2">{transaction.amount}</p>
                                        <p className="py-2 truncate">{transaction.communication}</p>
                                        <p className='hidden'>{transaction.donator_name || transaction.transactor}</p>
                                        <div className="py-2 relative">
                                            <select
                                                className={`border p-2 rounded w-full ${transaction.fund_id
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-300'
                                                    }`}
                                                value={selectedFunds[index]}
                                                onChange={(e) => handleFundChange(e, index)}
                                            >
                                                {funds.map((fund) => (
                                                    <option key={fund.id} value={fund.id}>{fund.name}</option>
                                                ))}
                                            </select>
                                            {transaction.fund_id && (
                                                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full">
                                                    ✓
                                                </span>
                                            )}
                                        </div>
                                    </React.Fragment>
                                ))}

                            </div>

                            <div className="flex justify-end mt-4">
                                <button
                                    type="submit"
                                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700"
                                    onClick={submitCsv}
                                >
                                    Ajouter les transactions
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </MainStructure>
        </>
    )
}
