import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import MainStructure from "@/Components/MainStructure.jsx";
import ActionButton from "@/Components/ActionButton.jsx";
import React, {useEffect, useState} from "react";
import {router, usePage} from "@inertiajs/react";
import Modal from "@/Components/Modal.jsx";
import {ModalCsv} from "@/Components/Modals/ModalCsv.jsx";

export default function Csv() {
    const {funds} = usePage().props;
    const {transactions} = usePage().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFunds, setSelectedFunds] = useState([]);

    useEffect(() => {
        if (transactions && transactions.length > 0 && funds.length > 0) {
            setSelectedFunds(transactions.map(() => funds[0].id));
        }
    }, [transactions, funds]);

    function openCsvModal(e) {
        e.preventDefault();
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);

    }


    function onSubmit(formData) {
        router.post(route('transaction.seed-csv-transactions'), formData, {
            forceFormData: true,
            onSuccess: () => {
            },
            onError: (errors) => {
                console.error('Erreur :', errors);
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
                        <div className='flex justify-center m-4'>
                            {transactions ? '' : <ActionButton
                                name="Importer un fichier CSV"
                                color="black"
                                onClick={openCsvModal}
                            />}

                        </div>
                    </div>
                </div>
                {isModalOpen && (<Modal onClose={closeModal}>
                    <ModalCsv closeModal={closeModal} onSubmit={onSubmit}/>
                </Modal>)}
                </div>
            </MainStructure>
        </>
    )
}
