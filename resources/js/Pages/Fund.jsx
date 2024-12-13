import {FundInfo} from "@/Components/FundInfo.jsx";
import {usePage} from "@inertiajs/react";
import MainStructure from "@/Components/MainStructure.jsx";
import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import {FondList} from "@/Components/FondList.jsx";
import React from "react";
import FondAction from "@/Components/FondAction.jsx";

export default function Fund() {
    const {fund, funds, transactions} = usePage().props
    return (
        <MainStructure pageTitle={fund.name}>
            <div className='flex flex-col w-full'>
                <div className="p-3 ">
                    <TitleAndSpan title="Fonds"/>
                    <FondList fonds={funds}/>
                    <FundInfo fund={fund} transactions={transactions} />
                </div>

            </div>
        </MainStructure>
    )
}
