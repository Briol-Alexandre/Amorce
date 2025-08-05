import { Link } from "@inertiajs/react";
import React from "react";

export default function Fond({ foundName, foundAmount, fond, isActive = false }) {
    // Classes conditionnelles : les fonds inactifs deviennent transparents
    const articleClasses = [
        'lg:border-none border-b-2 lg:pb-0 pb-4 lg:w-auto w-full',
        'transition-all duration-300 ease-in-out',
        isActive ? 'opacity-100' : 'opacity-50 hover:opacity-75'
    ].join(' ');
    
    const linkClasses = [
        'text-gray-900 hover:text-black'
    ].join(' ');
    
    const titleClasses = [
        'font-medium'
    ].join(' ');

    return (
        <>
            <article className={articleClasses}>
                <Link href={route('fond.show', fond)} className={linkClasses}>
                    <span className='flex items-center gap-2'>
                        <h4 className={titleClasses}>
                            {foundName}
                        </h4>
                        {fond.permanent ?
                            <p className='border-2 border-black inline font-bold rounded-xl px-2 text-sm text-white bg-black'>Permanent</p> : null}
                    </span>
                    <div className="flex gap-6">
                        <p className="found-name-style">
                            {foundAmount} €
                        </p>
                    </div>
                </Link>
            </article>
            <span className="bg-gray-300 w-0.5"></span>
        </>
    )
}
