import React from "react";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import ActionButton from "@/Components/ActionButton.jsx";

export default function FondAction({fund}) {

    function handleDelete (e) {
        e.preventDefault();
    }

    function handleAdd (e) {
        e.preventDefault();
    }

    function handleTransfer (e) {
        e.preventDefault();
    }

    return (
        <section>
            <h3 className="sr-only">Fond Principal (titre à mettre dynamique)</h3>
            <div className='flex justify-around'>
                {fund.permanent ? null : <form onSubmit={handleDelete}>
                    <ActionButton name="Supprimer le fond" color={'red'}/>
                </form>}

                <form onSubmit={handleAdd}>
                    <ActionButton name="Ajouter de l'argent" color={'blue'}/>
                </form>
                <form onSubmit={handleTransfer}>
                    <ActionButton name="Transférer vers un autre fond" color={'green'}/>
                </form>
            </div>
        </section>
    )
}
