import React, { useState } from "react";
import { DropIcon } from "@/Components/icons/DropIcon.jsx";
import { Transactions } from "@/Components/Transactions.jsx";
import FondAction from "@/Components/FondAction.jsx";

export function FundInfo({ fund, funds, transactions }) {
    const [isRotated, setIsRotated] = useState(true);
    const toggleRotation = () => {
        setIsRotated(!isRotated);
    };

    return (
        <section className="max-lg:px-2">
            <span className='flex flex-col items-start lg:items-center lg:ml-3 mt-6 gap-2 lg:flex-row justify-between'>
                <div className="flex flex-col items-start">
                    <h3 className='small-title-style text-left'>{fund.name}</h3>
                </div>
                <FondAction fund={fund} funds={funds} />
            </span>
            {fund.permanent ? <p className='small-style text-sm lg:text-base'><span className="font-bold ">Type de fond : </span>Permanent</p> : null}
            <p className="small-style mb-10 text-sm lg:text-base"><span className="font-bold">Description : </span>{fund.description}</p>
            <section className="lg:p-6 lg:mt-10">
                <div>
                    <Transactions
                        toggleRotation={toggleRotation}
                        isRotated={isRotated}
                        fund={fund}
                        transactions={transactions}
                    />
                </div>
            </section>
        </section>
    );
}
