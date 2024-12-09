import React, { useState } from "react";
import {useForm} from "@inertiajs/react";

export function ModalAdd({closeModal, handleAdd}) {

    const [addAmount, setAddAmount] = useState("");

    const handleInputChange = (e) => {
        setAddAmount(e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleAdd(addAmount);
    };

    return (
        <div>
            <h2 className="text-xl">Voulez-vous ajouter de l'argent à ce fond&nbsp;?</h2>
            <p className="text-gray-400">Entrez le montant à ajouter.</p>
            <form onSubmit={handleAdd}>
                <div className="mt-5 self-end">
                    <label htmlFor="addAmount">Montant</label>
                    <input
                        type="text"
                        name="addAmount"
                        id="addAmount"
                        className="rounded-md ml-3"
                        value={addAmount}
                        placeholder="XX €"
                        onChange={handleInputChange}
                    />
                </div>

                <div className="flex justify-end mt-8 gap-4">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="bg-white text-black px-4 py-2 rounded-md border border-1 hover:bg-gray-100"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-white hover:text-blue-500 border border-1 border-blue-500"
                    >
                        Ajouter
                    </button>
                </div>
            </form>
        </div>
    );
}
