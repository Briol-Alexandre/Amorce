import React, {useState} from "react";
import {DropIcon} from "@/Components/icons/DropIcon.jsx";

export function FundInfo({fund}) {
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
                <div className="flex items-center gap-4">
                    <h4>Historique des transactions</h4>
                    <span className="block h-0.5 bg-gray-300 mt-1.5 ml-2 flex-grow"></span>
                    <div onClick={toggleRotation}
                         className={isRotated ? 'rotate-180 transition duration-100' : 'rotate-0 transition duration-100'}>
                        <DropIcon/>
                    </div>
                </div>
            </section>
        </section>
    );
}
