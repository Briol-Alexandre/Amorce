import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import MainStructure from "@/Components/MainStructure.jsx";
import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import { FondList } from "@/Components/FondList.jsx";
import ActionButton from "@/Components/ActionButton.jsx";
import Modal from "@/Components/Modal.jsx";
import { ModalCsv } from "@/Components/Modals/ModalCsv.jsx";


export default function Funds() {
    const { funds } = usePage().props;
    const { transactions } = usePage().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
    const [selectedFunds, setSelectedFunds] = useState([]);

    function openCsvModal(e) {
        e.preventDefault();
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    function closeCheckModal() {
        setIsCheckModalOpen(false);
    }

    function handleFundChange(e, index) {
        const updatedFunds = [...selectedFunds];
        updatedFunds[index] = e.target.value;
        setSelectedFunds(updatedFunds);
    }

    function onSubmit(formData) {
        router.post(route('transaction.seed-csv-transactions'), formData, {
            forceFormData: true,
            onSuccess: (page) => {
                closeModal();
                setIsCheckModalOpen(true);
            },
        });
    }

    function submitCsv(e) {
        e.preventDefault();
        console.log(transactions)

        console.log('Transactions sélectionnées', selectedFunds);

        const formData = {
            transactions: transactions.map((transaction, index) => ({
                ...transaction,
                fund_id: selectedFunds[index],
            })),
        };

        console.log('Données à envoyer', formData);

        router.patch(route('transaction.store-csv-transactions'), formData, {
            forceFormData: true,
            onSuccess: (page) => {
                closeModal();
                setIsCheckModalOpen(true);
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    }


    return (
        <MainStructure pageTitle="Fonds">
            <div className='flex flex-col w-full'>
                <div className="p-3 ">
                    <TitleAndSpan title="Fonds" transactions={transactions} funds={funds} />
                    <FondList fonds={funds} />
                    <div className='flex justify-center pt-4'>
                        <ActionButton
                            name="Importer un fichier CSV"
                            color="black"
                            onClick={openCsvModal}
                        />
                    </div>
                </div>
            </div>

            {isModalOpen && (<Modal onClose={closeModal}>
                <ModalCsv closeModal={closeModal} onSubmit={onSubmit} />
            </Modal>)}

            {isCheckModalOpen && (<Modal onClose={closeCheckModal}>
                <form onSubmit={submitCsv}>
                    <div className="max-h-[80vh] w-[80vw] lg:w-[50vw] overflow-y-auto bg-white p-4 rounded-md">
                        <h2 className="text-xl pb-4 sticky -top-4 bg-white">Sélectionner un fond pour les transactions</h2>
                        <div className="grid grid-cols-[1fr_1fr_1fr_3fr_2fr] gap-4 bg-white p-4 rounded-md items-center">
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
                                    <div className="py-2">
                                        <select
                                            className="border border-gray-300 p-2 rounded w-full"
                                            value={selectedFunds[index] || ""}
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
                                onClick={closeCheckModal}
                                className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 border mr-4"
                            >
                                Fermer
                            </button>
                            <button
                                type="button"
                                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700"
                                onClick={submitCsv}
                            >
                                Ajouter les transactions
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>)}
        </MainStructure>
    );
}
