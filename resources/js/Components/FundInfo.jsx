import React, {useState} from "react";
import {DropIcon} from "@/Components/icons/DropIcon.jsx";
import {Transactions} from "@/Components/Transactions.jsx";

export function FundInfo({fund, transactions}) {
    const [isRotated, setIsRotated] = useState(false);
    const toggleRotation = () => {
        setIsRotated(!isRotated);
    };


    return (
        <section>
            <span className='flex items-center ml-3 mt-6 gap-2'>
                <h3 className='small-title-style'>{fund.name}</h3>
                {fund.permanent ? <p className='border-2 border-black inline rounded-xl px-2 text-sm text-white bg-black'>Permanent</p> : null}
            </span>
            <p className="small-style">{fund.description}</p>
            <section className="p-6">
                <div>
                    <Transactions toggleRotation={toggleRotation} isRotated={isRotated} fund={fund} transactions={transactions}/>
                </div>
            </section>
        </section>
    );
}
