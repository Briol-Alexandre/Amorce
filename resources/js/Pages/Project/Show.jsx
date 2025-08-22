import React from "react";
import MainStructure from "@/Components/MainStructure.jsx";
import { Link, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function Show({ project }) {
    const { delete: destroy } = useForm();

    function handleDelete() {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le projet "${project.name}" ?`)) {
            destroy(route('project.destroy', project.id));
        }
    }

    return (
        <MainStructure pageTitle={`Projet: ${project.name}`}>
            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">{project.name}</h1>
                    <div className="flex gap-2">
                        <Link
                            href={route('project.edit', project.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Modifier
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                            Supprimer
                        </button>
                        <Link
                            href={route('project.index')}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        >
                            Retour
                        </Link>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-center mb-6">
                            {project.image ? (
                                <img
                                    src={project.image}
                                    alt={project.name}
                                    className="w-32 h-32 object-cover rounded-full border-4 border-purple-500"
                                />
                            ) : (
                                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-purple-500">
                                    <span className="text-4xl text-gray-600 font-bold">
                                        {project.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Description</h2>
                            <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">{project.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </MainStructure>
    );
}
