import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError.jsx";
import { route } from "ziggy-js";

export default function EditProject({ project, onClose }) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const [imagePreview, setImagePreview] = useState(project.image);
    
    const { data, setData, errors, put, processing } = useForm({
        name: project.name,
        description: project.description,
        image: null,
        _method: 'PUT'
    });

    const customErrors = {
        ...errors,
        name: errors.name ? "Le nom du projet est obligatoire et doit comporter au moins 3 caractères" : null,
        description: errors.description ? "La description est obligatoire" : null,
        image: errors.image ? "L'image doit être au format JPG, PNG ou GIF et ne pas dépasser 2Mo" : null,
    };

    function submit(e) {
        e.preventDefault();
        put(route('project.update', project.id), {
            onSuccess: () => {
                console.log("Projet mis à jour avec succès !");
                onClose();
                // Recharger la page pour mettre à jour la liste des projets
                window.location.reload();
            },
        });
    }

    function handleChange(e) {
        setData(e.target.name, e.target.value);
    }
    
    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div>
            <h2 className="text-xl mb-4">Modifier le projet</h2>
            <p className="text-gray-400">Modifiez les informations du projet {project.name}.</p>
            
            <form onSubmit={submit}>
                <input type="hidden" name="_token" value={csrfToken} />

                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-center">
                    <label htmlFor="name">Nom du projet</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="rounded-md ml-3"
                        value={data.name}
                        onChange={handleChange}
                        placeholder="Nom du projet ou de l'association"
                    />
                </fieldset>
                {customErrors.name && <InputError message={customErrors.name} />}

                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-start">
                    <label htmlFor="description">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        className="rounded-md ml-3 h-24"
                        value={data.description}
                        onChange={handleChange}
                        placeholder="Description du projet ou de l'association"
                    />
                </fieldset>
                {customErrors.description && <InputError message={customErrors.description} />}

                <fieldset className="mt-5 self-end grid grid-cols-[1fr_3fr] items-start">
                    <label htmlFor="image">Logo / Image</label>
                    <div className="ml-3">
                        <input
                            type="file"
                            name="image"
                            id="image"
                            className="rounded-md w-full"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                        <p className="text-xs text-gray-500 mt-1">Formats acceptés: JPG, PNG, GIF. Taille max: 2Mo</p>
                        
                        {imagePreview && (
                            <div className="mt-3">
                                <p className="text-sm font-medium mb-1">Aperçu:</p>
                                <img 
                                    src={imagePreview} 
                                    alt="Aperçu" 
                                    className="w-32 h-32 object-cover rounded-md border border-gray-300" 
                                />
                            </div>
                        )}
                    </div>
                </fieldset>
                {customErrors.image && <InputError message={customErrors.image} />}
                
                <div className="flex justify-end mt-8 gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-white text-black px-4 py-2 rounded-md border border-1 hover:bg-gray-100"
                        disabled={processing}
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-white hover:text-purple-500 border border-1 border-purple-500"
                        disabled={processing}
                    >
                        {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                </div>
            </form>
        </div>
    );
}
