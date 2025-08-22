import React, { useState } from "react";
import MainStructure from "@/Components/MainStructure.jsx";
import { useForm, Link } from "@inertiajs/react";
import InputError from "@/Components/InputError.jsx";
import { route } from "ziggy-js";

export default function Edit({ project }) {
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
        <MainStructure pageTitle={`Modifier: ${project.name}`}>
            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Modifier le projet</h1>
                    <Link
                        href={route('project.show', project.id)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                        Annuler
                    </Link>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                                    Nom du projet
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
                                    value={data.name}
                                    onChange={handleChange}
                                />
                                {customErrors.name && <InputError message={customErrors.name} />}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    rows="6"
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
                                    value={data.description}
                                    onChange={handleChange}
                                ></textarea>
                                {customErrors.description && <InputError message={customErrors.description} />}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
                                    Logo / Image
                                </label>
                                <input
                                    type="file"
                                    name="image"
                                    id="image"
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Formats acceptés: JPG, PNG, GIF. Taille max: 2Mo
                                </p>
                                {customErrors.image && <InputError message={customErrors.image} />}
                            </div>

                            {imagePreview && (
                                <div className="mb-4">
                                    <p className="block text-gray-700 font-medium mb-2">Aperçu</p>
                                    <img
                                        src={imagePreview}
                                        alt="Aperçu"
                                        className="w-32 h-32 object-cover rounded-md border border-gray-300"
                                    />
                                </div>
                            )}

                            <div className="flex justify-end mt-6">
                                <button
                                    type="submit"
                                    className="bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                                    disabled={processing}
                                >
                                    {processing ? "Enregistrement..." : "Enregistrer les modifications"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainStructure>
    );
}
