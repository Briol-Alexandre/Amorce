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
                onError: (errors) => setErrors({csv: 'Erreur lors de l\'import du fichier CSV'}),
            });
        } else {
            setErrors({csv: 'Veuillez sélectionner un fichier CSV'});
        }
    };

    const renderField = (name, label, type = "text", placeholder = "") => (
        <>
            <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
                <label htmlFor={name}>{label}</label>
                <input
                    type={type}
                    name={name}
                    id={name}
                    className="rounded-md ml-3"
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
            <h2 className="text-xl">Voulez-vous ajouter de l'argent à ce fond&nbsp;?</h2>
            <p className="text-gray-400">Choisissez une méthode d'ajout.</p>
            
            <div className="flex space-x-4 mt-4 mb-6">
                {["manual", "csv"].map(method => (
                    <button 
                        key={method}
                        type="button" 
                        onClick={() => { setAddMethod(method); setErrors({}); }}
                        className={`px-4 py-2 rounded-md ${addMethod === method 
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
                        
                        <div className="mt-5 relative">
                            <fieldset className="self-end grid grid-cols-[1fr_3fr] items-center">
                                <label htmlFor="donator-search">Donateur</label>
                                <div className="ml-3 relative">
                                    <input 
                                        id="donator-search" 
                                        type="text"
                                        className="rounded-md w-full"
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
                                                className="p-2 hover:bg-gray-100 cursor-pointer border-b"
                                                onClick={createNewDonator}
                                            >
                                                <strong>+ Nouveau donateur</strong>
                                            </div>
                                            
                                            {filteredDonators.map(donator => (
                                                <div 
                                                    key={donator.id} 
                                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => selectDonator(donator)}
                                                >
                                                    {donator.name}
                                                    {donator.email && <span className="text-xs text-gray-500 block">{donator.email}</span>}
                                                </div>
                                            ))}
                                            
                                            {filteredDonators.length === 0 && searchQuery.trim() !== '' && (
                                                <div className="p-2 text-gray-500">
                                                    Aucun donateur trouvé
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </fieldset>
                            
                            {selectedDonator && !isNewDonator && (
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                    <p className="text-sm text-blue-700">
                                        <strong>Donateur sélectionné:</strong> {formData.transactor}
                                        {formData.email && <span className="block">Email: {formData.email}</span>}
                                        {formData.phone && <span className="block">Téléphone: {formData.phone}</span>}
                                    </p>
                                    <button 
                                        type="button" 
                                        className="text-xs text-blue-600 mt-2 underline"
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
                        <p className="text-gray-600 mb-4">Déposez le fichier CSV contenant les transactions à importer.</p>
                        <fieldset className="mt-5 self-end grid grid-row-[1fr_3fr] gap-2 items-center">
                            <label htmlFor="csv">Fichier CSV</label>
                            <input
                                type="file"
                                name="csv"
                                id="csv"
                                accept=".csv"
                                onChange={(e) => setCsvFile(e.target.files[0])}
                                className="border p-2 rounded-md w-full"
                            />
                        </fieldset>
                        {errors.csv && <InputError message={errors.csv} />}
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-700">
                                <strong>Note:</strong> Le système vérifiera automatiquement les doublons pour éviter la duplication d'argent.
                            </p>
                        </div>
                    </>
                )}
                
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
                        {addMethod === "manual" ? "Ajouter" : "Importer"}
                    </button>
                </div>
            </form>
        </div>
    );
}
