import { Link } from "@inertiajs/react";
import React from "react";

export default function Fond({ foundName, foundAmount, fond, isActive = false, isLast = false }) {
    // Classes conditionnelles : mise en évidence du fond actif
    const articleClasses = [
        'lg:border-none last:border-none border-b-2 lg:pb-2 pb-4 w-full',
        'transition-all duration-300 ease-in-out',
        'flex justify-center items-center',
        'lg:flex-1',  // Prend une part égale de l'espace disponible
        'py-2 mx-2', // Arrondi et padding vertical pour tous les fonds
        isActive ? 'bg-gray-100 opacity-100' : 'opacity-70 hover:opacity-90'
    ].join(' ');

    const linkClasses = [
        isActive ? 'text-black font-medium' : 'text-gray-900 hover:text-black',
        'w-full px-3' // Largeur complète et padding horizontal
    ].join(' ');

    const titleClasses = [
        isActive ? 'font-bold' : 'font-medium',
        isActive ? 'lg:text-lg line-clamp-1' : 'lg:text-base line-clamp-1'
    ].join(' ');

    return (
        <>
            <article className={articleClasses}>
                <Link href={route('fond.show', fond)} className={`${linkClasses} lg:text-center`}>
                    <span className='flex items-center gap-2'>
                        <h4 className={titleClasses}>
                            {isActive ? '→ ' : ''}{foundName}
                        </h4>
                        {fond.permanent ?
                            <p className='border-2 border-black inline font-bold rounded-xl px-2 text-sm text-white bg-black'>Permanent</p> : null}
                    </span>
                    <div className="flex gap-6">
                        <p className={`found-name-style ${isActive ? 'font-bold' : ''}`}>
                            {foundAmount} €
                        </p>
                    </div>
                </Link>
            </article>
            {!isLast && <span className="bg-gray-300 w-0.5"></span>}
        </>
    )
}
