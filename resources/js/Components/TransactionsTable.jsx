import React from "react";
import {format} from "date-fns";

export function TransactionsTable({transactions}) {
    return (
        <>
            {transactions.length === 0 ?
                <p className='text-center m-4 font-bold'>Ce fond n'a pas encore de transactions.</p>
                :
                <div className="px-6 mt-4">
                    <ul>
                        <li className='grid grid-cols-3 items-center mb-6 border-b-2 border-gray-400 pb-4'>
                            <span className=' font-bold'>Date</span>
                            <span className='text-center font-bold'>Montant</span>
                            <span className='text-right font-bold'>Communication</span>
                        </li>
                        {transactions.map((transaction) => (
                            <li
                                key={transaction.id} // Assure-toi que chaque transaction a un identifiant unique
                                className='grid grid-cols-3 items-center border-b-2 border-gray-200 mb-4 pb-4 last-of-type:border-none'
                            >
                                <span>{format(new Date(transaction.date), 'MM-yyyy')}</span>
                                <span className='text-center'>{transaction.amount}&nbsp;€</span>
                                <span className='text-right'>{transaction.communication}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            }
        </>
    )
}
