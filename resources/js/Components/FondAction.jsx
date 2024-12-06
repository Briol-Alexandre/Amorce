import React from "react";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import ActionButton from "@/Components/ActionButton.jsx";

export default function FondAction() {
    return (
        <section>
            <h3 className="sr-only">Fond Principal (titre à mettre dynamique)</h3>
            <div className='flex justify-around'>
                <ActionButton name="Supprimer le fond" color={'red'}/>
                <ActionButton name="Ajouter de l'argent" color={'blue'}/>
                <ActionButton name="Transférer vers un autre fond" color={'green'}/>
            </div>
        </section>
    )
}
