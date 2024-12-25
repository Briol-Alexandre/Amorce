import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import MainStructure from "@/Components/MainStructure.jsx";
import ActionButton from "@/Components/ActionButton.jsx";
import React, {useEffect, useState} from "react";
import {router, usePage} from "@inertiajs/react";


export default function CsvList() {
    const {funds, transactions} = usePage().props;

    const [selectedFunds, setSelectedFunds] = useState([]);

    useEffect(() => {
        if (transactions && transactions.length > 0 && funds.length > 0) {
            setSelectedFunds(transactions.map(() => funds[0].id));
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
                fund_id: selectedFunds[index],
            })),
        };

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
                            <TitleAndSpan title='CSV'/>
                        </div>
                    </div>
                        <form onSubmit={submitCsv}>
                            <div className="max-h-[80vh] overflow-y-auto bg-white p-4 rounded-md">
                                <h2 className="text-xl pb-4 sticky -top-4 font-bold bg-white">Sélectionner un fond pour les
                                    transactions</h2>
                                <div
                                    className="grid grid-cols-[1fr_1fr_1fr_3fr_2fr] gap-4 bg-white p-4 rounded-md items-center">
                                    <p className="font-bold text-left sticky top-5 pb-5 bg-white z-10">Id</p>
                                    <p className="font-bold text-left sticky top-5 pb-5 bg-white z-10">Date</p>
                                    <p className="font-bold text-left sticky top-5 pb-5 bg-white z-10">Montant</p>
                                    <p className="font-bold text-left sticky top-5 pb-5 bg-white z-10">Communication</p>
                                    <p className="font-bold text-left sticky top-5 pb-5 bg-white z-10">Fonds</p>
                                    {Array.isArray(transactions) && transactions.map((transaction, index) => (
                                        <React.Fragment key={index}>
                                            <p>{index + 1}</p>
                                            <p className="py-2">{transaction.date}</p>
                                            <p className="py-2">{transaction.amount}</p>
                                            <p className="py-2 truncate">{transaction.communication}</p>
                                            <p className='hidden'>{transaction.transactor}</p>
                                            <div className="py-2">
                                                <select
                                                    className="border border-gray-300 p-2 rounded w-full"
                                                    value={selectedFunds[index]}
                                                    onChange={(e) => handleFundChange(e, index)}
                                                >
                                                    {funds.map((fund) => (
                                                        <option key={fund.id} value={fund.id}>{fund.name}</option>
                                                    ))}
                                                </select>
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
