import React from "react";
import {DropIcon} from "@/Components/icons/DropIcon.jsx";
import {TransactionsTable} from "@/Components/TransactionsTable.jsx";

export function Transactions({toggleRotation, isRotated, fund, transactions}) {
    return (
        <section>
            <div className='flex items-center gap-4 cursor-pointer' onClick={toggleRotation}>
                <h4>Historique des transactions</h4>
                <span className="block h-0.5 bg-gray-300 mt-1.5 ml-2 flex-grow"></span>

                {/* Icon to toggle rotation */}
                <div className={isRotated ? 'rotate-180 transition duration-100' : 'rotate-0 transition duration-100'}>
                    <DropIcon />
                </div>
            </div>

            {/* Display the TransactionsTable only if isRotated is true */}
            {isRotated && <TransactionsTable transactions={transactions} />}
        </section>
    );
}
