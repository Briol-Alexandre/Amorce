import React, {useState} from "react";
import {DropIcon} from "@/Components/icons/DropIcon.jsx";
import {Transactions} from "@/Components/Transactions.jsx";
import FondAction from "@/Components/FondAction.jsx";

export function FundInfo({fund, funds, transactions}) {
    const [isRotated, setIsRotated] = useState(true);
    const toggleRotation = () => {
        setIsRotated(!isRotated);
    };

    return (
        <section>
            <span className='flex items-center ml-3 mt-6 gap-2'>
                <h3 className='small-title-style'>{fund.name}</h3>
                {fund.permanent ? <p className='border-2 border-black inline rounded-xl px-2 text-sm text-white bg-black'>Permanent</p> : null}
            </span>
            <p className="small-style mb-10">{fund.description}</p>
            <FondAction fund={fund} funds={funds}/>
            <section className="p-6 mt-10">
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
