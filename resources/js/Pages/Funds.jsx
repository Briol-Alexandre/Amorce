import React, {useState} from "react";
import {usePage} from "@inertiajs/react";
import MainStructure from "@/Components/MainStructure.jsx";
import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import {FondList} from "@/Components/FondList.jsx";

export default function Funds() {
    const {funds} = usePage().props;
    const {transactions} = usePage().props;

    return (
        <MainStructure pageTitle="Fonds">
            <div className='flex flex-col w-full'>
                <div className="p-3 ">
                    <TitleAndSpan title="Fonds" transactions={transactions} funds={funds}/>
                    <FondList fonds={funds}/>
                </div>
            </div>
        </MainStructure>
    );
}
