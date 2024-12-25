import React, {useEffect, useState} from "react";
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
    return (
        <MainStructure pageTitle="Fonds">
            <div className='flex flex-col w-full'>
                <div className="p-3 ">
                    <TitleAndSpan title="Fonds" transactions={transactions} funds={funds} />
                    <FondList fonds={funds} />
                </div>
            </div>
        </MainStructure>
    );
}
