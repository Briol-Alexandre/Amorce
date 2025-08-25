import React, { useState, useEffect, useRef } from "react";
import InputError from "@/Components/InputError.jsx";
import { router } from "@inertiajs/react";
import axios from "axios";

export function ModalAdd({ closeModal, handleAdd, fund }) {
    const [addMethod, setAddMethod] = useState("manual");
    const [csvFile, setCsvFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [donators, setDonators] = useState([]);
    const [filteredDonators, setFilteredDonators] = useState([]);
    const [selectedDonator, setSelectedDonator] = useState(null);
    const [isNewDonator, setIsNewDonator] = useState(false); // Par défaut, pas en mode nouveau donateur
    const [searchQuery, setSearchQuery] = useState("");
    const [showResults, setShowResults] = useState(false);
    const searchResultsRef = useRef(null);
    const [formData, setFormData] = useState({
        amount: "",
        date: "",
        transactor: "",
        communication: "",
        fund_id: fund.id,
        email: "",
        phone: "",
    });

    // Charger la liste des donateurs au chargement du composant
    useEffect(() => {
        const fetchDonators = async () => {
            try {
                const response = await axios.get(route('transaction.donators'));
                setDonators(response.data);
                setFilteredDonators(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement des donateurs:", error);
            }
        };

        fetchDonators();

        // Ajouter un gestionnaire d'événement pour fermer les résultats lors d'un clic en dehors
        const handleClickOutside = (event) => {
            if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Filtrer les donateurs en fonction de la recherche
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredDonators(donators);
        } else {
            const filtered = donators.filter(donator =>
                donator.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredDonators(filtered);
        }

        // Afficher les résultats si la recherche n'est pas vide
        setShowResults(searchQuery.trim() !== '');
    }, [searchQuery, donators]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const selectDonator = (donator) => {
        setSelectedDonator(donator);
        setIsNewDonator(false);
        setFormData(prev => ({
            ...prev,
            transactor: donator.name,
            email: donator.email || "",
            phone: donator.phone || ""
        }));
        setSearchQuery(""); // Effacer la recherche
        setShowResults(false); // Masquer les résultats
    };

    const createNewDonator = () => {
        setSelectedDonator(null);
        setIsNewDonator(true);
        setFormData(prev => ({
            ...prev,
            transactor: "",
            email: "",
            phone: ""
        }));
        setSearchQuery(""); // Effacer la recherche
        setShowResults(false); // Masquer les résultats
    };

    const validateForm = () => {
        const requiredFields = {
            amount: !formData.amount || isNaN(formData.amount) ? "Le montant est requis et doit être un nombre valide." : null,
            date: !formData.date ? "La date est requise." : null,
            transactor: !formData.transactor ? "Le nom du transacteur est requis." : null,
            communication: !formData.communication ? "La communication est requise." : null,
        };

        const formErrors = Object.fromEntries(
            Object.entries(requiredFields).filter(([_, value]) => value !== null)
        );

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (addMethod === "manual") {
            if (validateForm()) {
                handleAdd(formData);
                closeModal();
            }
        } else if (csvFile) {
            const data = new FormData();
            data.append('csv', csvFile);

            router.post(route('transaction.seed-csv-transactions'), data, {
                forceFormData: true,
                onSuccess: closeModal,
                onError: (errors) => setErrors({ csv: 'Erreur lors de l\'import du fichier CSV' }),
            });
        } else {
            setErrors({ csv: 'Veuillez sélectionner un fichier CSV' });
        }
    };

    const renderField = (name, label, type = "text", placeholder = "") => (
        <>
            <fieldset className="mt-3 self-end grid lg:grid-cols-[1fr_3fr] max-lg:grid-cols-1 max-lg:gap-1 items-center">
                <label htmlFor={name} className="max-lg:text-sm">{label}</label>
                <input
                    type={type}
                    name={name}
                    id={name}
                    className="rounded-md lg:ml-3 max-lg:mt-1"
                    value={formData[name]}
                    placeholder={placeholder}
                    onChange={handleInputChange}
                />
            </fieldset>
            {errors[name] && <InputError message={errors[name]} />}
        </>
    );

    return (
        <div>
            <h2 className="lg:text-xl max-lg:text-lg max-lg:font-semibold max-lg:mt-2">Voulez-vous ajouter de l'argent à ce fond&nbsp;?</h2>
            <p className="max-lg:text-sm text-gray-400 max-lg:mt-1">Choisissez une méthode d'ajout.</p>

            <div className="flex space-x-2 lg:space-x-4 mt-3 lg:mt-4 mb-4 lg:mb-6">
                {["manual", "csv"].map(method => (
                    <button
                        key={method}
                        type="button"
                        onClick={() => { setAddMethod(method); setErrors({}); }}
                        className={`lg:px-4 lg:py-2 max-lg:px-2 max-lg:py-1 max-lg:text-sm rounded-md ${addMethod === method
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    >
                        {method === "manual" ? "Ajouter manuellement" : "Importer depuis un CSV"}
                    </button>
                ))}
            </div>

            <form onSubmit={onSubmit}>
                <input type="hidden" name="fund_id" value={formData.fund_id} />

                {addMethod === "manual" ? (
                    <>
                        {renderField("amount", "Montant", "text", "XX €")}
                        {renderField("date", "Date", "date")}

                        <div className="mt-3 relative">
                            <fieldset className="self-end grid lg:grid-cols-[1fr_3fr] max-lg:grid-cols-1 max-lg:gap-1 items-center">
                                <label htmlFor="donator-search" className="max-lg:text-sm">Donateur</label>
                                <div className="lg:ml-3 max-lg:mt-1 relative">
                                    <input
                                        id="donator-search"
                                        type="text"
                                        className="rounded-md w-full max-lg:text-sm"
                                        placeholder="Rechercher un donateur existant..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onClick={() => setShowResults(true)}
                                    />

                                    {/* Liste des résultats de recherche */}
                                    {showResults && (
                                        <div
                                            ref={searchResultsRef}
                                            className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                                        >
                                            <div
                                                className="p-2 hover:bg-gray-100 cursor-pointer border-b max-lg:text-sm max-lg:py-3"
                                                onClick={createNewDonator}
                                            >
                                                + Créer un nouveau donateur
                                            </div>

                                            {filteredDonators.map(donator => (
                                                <div
                                                    key={donator.id}
                                                    className="p-2 hover:bg-gray-100 cursor-pointer max-lg:text-sm max-lg:py-3"
                                                    onClick={() => selectDonator(donator)}
                                                >
                                                    {donator.name}
                                                    {donator.email && <span className="text-xs text-gray-500 block max-lg:text-xs">{donator.email}</span>}
                                                </div>
                                            ))}

                                            {filteredDonators.length === 0 && searchQuery.trim() !== '' && (
                                                <div className="p-2 text-gray-500 max-lg:text-sm">
                                                    Aucun donateur trouvé
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </fieldset>

                            {selectedDonator && !isNewDonator && (
                                <div className="mt-3 lg:mt-4 p-2 lg:p-3 bg-blue-50 border border-blue-200 rounded-md">
                                    <p className="text-sm text-blue-700 max-lg:text-xs">
                                        <strong className="max-lg:block max-lg:mb-1">Donateur sélectionné:</strong> {formData.transactor}
                                        {formData.email && <span className="block max-lg:text-xs max-lg:mt-1">Email: {formData.email}</span>}
                                        {formData.phone && <span className="block max-lg:text-xs max-lg:mt-1">Téléphone: {formData.phone}</span>}
                                    </p>
                                    <button
                                        type="button"
                                        className="text-xs text-blue-600 mt-1 lg:mt-2 underline"
                                        onClick={createNewDonator}
                                    >
                                        Utiliser un autre donateur
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Afficher les champs uniquement si l'utilisateur a cliqué sur "Nouveau donateur" */}
                        {isNewDonator && (
                            <>
                                {renderField("transactor", "Nom du donateur", "text", "Mr. Doe")}
                                {renderField("email", "Email", "email", "email@example.com")}
                                {renderField("phone", "Téléphone", "tel", "+32 123 456 789")}
                            </>
                        )}

                        {/* Toujours afficher le champ communication */}
                        {renderField("communication", "Communication", "text", "Entrez une communication")}
                    </>
                ) : (
                    <>
                        <p className="text-gray-600 mb-4 max-lg:text-sm">Déposez le fichier CSV contenant les transactions à importer.</p>
                        <fieldset className="mt-3 self-end grid lg:grid-cols-[1fr_3fr] max-lg:grid-cols-1 max-lg:gap-1 items-center">
                            <label htmlFor="csv" className="max-lg:text-sm">Fichier CSV</label>
                            <input
                                type="file"
                                name="csv"
                                id="csv"
                                accept=".csv"
                                onChange={(e) => setCsvFile(e.target.files[0])}
                                className="border p-2 rounded-md w-full lg:ml-3 max-lg:mt-1"
                            />
                        </fieldset>
                        {errors.csv && <InputError message={errors.csv} />}
                        <div className="mt-3 lg:mt-4 p-2 lg:p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-700 max-lg:text-xs">
                                <strong>Note:</strong> Le système vérifiera automatiquement les doublons pour éviter la duplication d'argent.
                            </p>
                        </div>
                    </>
                )}

                <div className="flex justify-end mt-6 lg:mt-8 gap-2 lg:gap-4">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="bg-white text-black lg:px-4 lg:py-2 max-lg:px-2 max-lg:py-1 max-lg:text-sm rounded-md border border-1 hover:bg-gray-100"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white lg:px-4 lg:py-2 max-lg:px-2 max-lg:py-1 max-lg:text-sm rounded-md hover:bg-white hover:text-blue-500 border border-1 border-blue-500"
                    >
                        {addMethod === "manual" ? "Ajouter" : "Importer"}
                    </button>
                </div>
            </form>
        </div>
    );
}
