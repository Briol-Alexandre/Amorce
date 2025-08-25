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
        <div className="max-lg:w-full">
            <h2 className="lg:text-xl max-lg:text-lg max-lg:font-semibold max-lg:mt-2 mb-2 lg:mb-4">Importer un CSV</h2>
            <p className="text-gray-400 max-lg:text-sm max-lg:mt-1">Déposez le fichier .csv</p>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <fieldset className="mt-3 lg:mt-3 self-end grid grid-row-[1fr_3fr] gap-2 items-center">
                    <label htmlFor="csv" className="max-lg:text-sm">Fichier CSV</label>
                    <input
                        type="file"
                        name="csv"
                        id="csv"
                        accept=".csv"
                        onChange={handleFileChange}
                    />
                </fieldset>

                <div className="flex justify-end mt-6 lg:mt-8 lg:gap-4 max-lg:gap-2">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="bg-white text-black lg:px-4 lg:py-2 max-lg:px-2 max-lg:py-1 max-lg:text-sm rounded-md border border-1 hover:bg-gray-100"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="bg-black text-white lg:px-4 lg:py-2 max-lg:px-2 max-lg:py-1 max-lg:text-sm rounded-md hover:bg-white hover:text-black border border-1 border-black"
                    >
                        Importer
                    </button>
                </div>
            </form>
        </div>
    );
}
