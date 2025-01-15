import React, {useState} from "react";
import ActionButton from "@/Components/ActionButton.jsx";
import Modal from "@/Components/Modal.jsx";
import {ModalCsv} from "@/Components/Modals/ModalCsv.jsx";
import {Link, router} from "@inertiajs/react";
import {AddIcon} from "@/Components/icons/AddIcon.jsx";

export default function TitleAndSpan({title, onClick}) {
    return (<>
        <div className="flex justify-between">
            <h2 className="title-style hover:cursor-pointer"
                onClick={onClick}>{title}</h2>
            {title === 'Fonds' && (
                <Link href='/csv' className='bg-black text-white p-2 rounded hover:bg-white hover:text-black border border-black'>
                    Ajouter un Csv
                </Link>
            )
            }
            {title === 'Compte' && (
                <Link href='/addUser' className='bg-black text-white p-2 rounded hover:bg-white hover:text-black border border-black'>
                    Ajouter un nouvel utilisateur
                </Link>
            )
            }
        </div>
        <span className="block h-0.5 bg-gray-300 mt-1.5"></span>

    </>);
}
