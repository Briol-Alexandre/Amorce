import React, {useState} from "react";
import ActionButton from "@/Components/ActionButton.jsx";
import Modal from "@/Components/Modal.jsx";
import {ModalCsv} from "@/Components/Modals/ModalCsv.jsx";
import {router} from "@inertiajs/react";

export default function TitleAndSpan({title, transactions, funds}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);

    function openCsvModal(e) {
        e.preventDefault();
        setIsModalOpen(true);
    }

    function openCheckCsv() {
        setIsCheckModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    function closeCheckModal() {
        setIsCheckModalOpen(false);
    }

    function onSubmit(formData) {
        router.post(route('transaction.seed-csv-transactions'), formData, {
            forceFormData: true, onSuccess: (page) => {
                closeModal();
                setIsCheckModalOpen(true);
            },
        });
    }

    return (<>
        <div className="flex justify-between">
            <h2 className="title-style">{title}</h2>

            {title === 'Fonds' && (<ActionButton
                name="Importer un fichier CSV"
                color="black"
                onClick={openCsvModal}
            />)}
        </div>
        <span className="block h-0.5 bg-gray-300 mt-1.5"></span>

        {isModalOpen && (<Modal onClose={closeModal}>
            <ModalCsv closeModal={closeModal} onSubmit={onSubmit}/>
        </Modal>)}

        {isCheckModalOpen && (<Modal onClose={closeCheckModal}>
            <div className="max-h-[80vh] w-[80vw] lg:w-[50vw] overflow-y-auto bg-white p-4 rounded-md">
                <h2 className="text-xl pb-4 sticky -top-4 bg-white">Sélectionner un fond pour les transactions</h2>
                <div className="grid grid-cols-[1fr_1fr_3fr_2fr] gap-4 bg-white p-4 rounded-md items-center">
                    <p className="font-bold text-left sticky top-5 pb-5 bg-white z-10">Date</p>
                    <p className="font-bold text-left sticky top-5 pb-5 bg-white z-10">Montant</p>
                    <p className="font-bold text-left sticky top-5 pb-5 bg-white z-10">Communication</p>
                    <p className="font-bold text-left sticky top-5 pb-5 bg-white z-10">Action</p>
                    {transactions.map((transaction, index) => (
                        <React.Fragment key={index}>
                            <p className="py-2">{transaction.date}</p>
                            <p className="py-2">{transaction.amount}</p>
                            <p className="py-2 truncate">{transaction.communication}</p>
                            <div className="py-2">
                                <select
                                    className="border border-gray-300 p-2 rounded w-full"
                                    onChange={(e) => console.log(`Fond choisi: ${e.target.value}`)}
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
                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                        Fermer
                    </button>
                </div>
            </div>

        </Modal>)}

    </>);
}
