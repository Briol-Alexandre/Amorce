import React, { useState } from "react";

export function ModalCsv({ closeModal, onSubmit }) {
    const [formData, setFormData] = useState({
        csv: null,
    });

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            csv: e.target.files[0],
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.csv) {
            const data = new FormData();
            data.append('csv', formData.csv);

            onSubmit(data);

            closeModal();
        } else {
            console.error('Aucun fichier CSV sélectionné');
        }
    };

    return (
        <div>
            <h2 className="text-xl mb-4">Importer un CSV</h2>
            <p className="text-gray-400">Déposez le fichier .csv</p>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <fieldset className="mt-5 self-end grid grid-row-[1fr_3fr] gap-2 items-center">
                    <label htmlFor="csv">Fichier CSV</label>
                    <input
                        type="file"
                        name="csv"
                        id="csv"
                        accept=".csv"
                        onChange={handleFileChange}
                    />
                </fieldset>

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
                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-white hover:text-black border border-1 border-black"
                    >
                        Importer
                    </button>
                </div>
            </form>
        </div>
    );
}
