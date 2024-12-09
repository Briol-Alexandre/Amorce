import React from "react";

export function ModalTransfer({closeModal, handleTransfer}) {
    return (
        <div>
            <h2 className="text-xl mb-4">Transférer de l'argent de ce fond&nbsp;?</h2>
            <p className="text-gray-400">Sélectionnez un fond destinataire pour le transfert.</p>
            <div className="flex justify-end mt-4 gap-4">
                <button onClick={closeModal}
                        className="bg-white text-black px-4 py-2 rounded-md border border-1 hover:bg-gray-100">
                    Annuler
                </button>
                <button onClick={handleTransfer}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-white hover:text-green-500 border border-1 border-green-500">
                    Transférer
                </button>
            </div>
        </div>
    )
}
