import { Link } from "@inertiajs/react";
import React from "react";

export default function Fond({ foundName, foundAmount, fond }) {
    return (
        <>
            <article className='lg:border-none border-b-2 lg:pb-0 pb-4 lg:w-auto w-full'>
                <Link href={route('fond.show', fond)}>
                    <span className='flex items-center gap-2'>
                        <h4>
                            {foundName}
                        </h4>
                        {fond.permanent ?
                            <p className='border-2 border-black inline font-bold rounded-xl px-2 text-sm w text-white bg-black'>Permanent</p> : null}
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
