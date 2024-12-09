import React from "react";

export function ModalDelete({closeModal, handleDelete}) {
    return (
        <div>
            <h2 className="text-xl mb-4">Supprimer ce fond&nbsp;?</h2>
            <p className="text-gray-400">Supprimer un fond le déplacera dans la corbeille. Vous pourrez le
                supprimer définitivement là-bas.</p>
            <div className="flex justify-end mt-4 gap-4">
                <button onClick={closeModal}
                        className="bg-white text-black px-4 py-2 rounded-md border border-1 hover:bg-gray-100">
                    Annuler
                </button>
                <button onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-white hover:text-red-500 border border-1 border-red-500">
                    Supprimer
                </button>
            </div>
        </div>
    )
}
