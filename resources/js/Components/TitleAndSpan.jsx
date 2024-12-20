import React, {useState} from "react";
import ActionButton from "@/Components/ActionButton.jsx";
import Modal from "@/Components/Modal.jsx";
import {ModalCsv} from "@/Components/Modals/ModalCsv.jsx";
import {router} from "@inertiajs/react";

export default function TitleAndSpan({title}) {
    return (<>
        <div className="flex justify-between">
            <h2 className="title-style hover:cursor-pointer"
                onClick={() => router.visit(route('fond.index'))}>{title}</h2>
            {title === 'Fonds' && (
                <ActionButton name='Ajouter un CSV' onClick={() => router.visit(route('fond.index'))} color="black"/>
            )
            }
        </div>
        <span className="block h-0.5 bg-gray-300 mt-1.5"></span>

    </>);
}
