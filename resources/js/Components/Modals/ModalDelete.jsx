import React from "react";

export function ModalDelete({closeModal, handleDelete}) {
    return (
        <div>
            <h2 className="lg:text-xl max-lg:text-lg max-lg:font-semibold max-lg:mt-2 mb-2 lg:mb-4">Supprimer ce fond&nbsp;?</h2>
            <p className="text-gray-400 max-lg:text-sm max-lg:mt-1">Supprimer un fond le supprimera définitivement.</p>
            <div className="flex justify-end mt-4 lg:gap-4 max-lg:gap-2">
                <button onClick={closeModal}
                        className="bg-white text-black lg:px-4 lg:py-2 max-lg:px-2 max-lg:py-1 max-lg:text-sm rounded-md border border-1 hover:bg-gray-100">
                    Annuler
                </button>
                <button onClick={handleDelete}
                        className="bg-red-500 text-white lg:px-4 lg:py-2 max-lg:px-2 max-lg:py-1 max-lg:text-sm rounded-md hover:bg-white hover:text-red-500 border border-1 border-red-500">
                    Supprimer
                </button>
            </div>
        </div>
    )
}
