import React from "react";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { usePage } from "@inertiajs/react";

export default function ShowProject({ project, onClose, onEdit }) {
    const { delete: destroy } = useForm();
    const { auth } = usePage().props;

    function handleDelete() {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le projet "${project.name}" ?`)) {
            destroy(route('project.destroy', project.id), {
                onSuccess: () => {
                    onClose();
                    window.location.reload();
                }
            });
        }
    }

    return (
        <div className="w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{project.name}</h2>
            </div>

            <div className="bg-white rounded-lg overflow-hidden">
                <div className="p-4">
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
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">{project.description}</p>
                    </div>

                    <div className="flex justify-end mt-8 gap-4">
                        {auth.permissions && auth.permissions.includes('manage-projects') && (
                            <>
                                <button
                                    onClick={onEdit}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-white hover:text-blue-500 border border-blue-500"
                                >
                                    Modifier
                                </button>

                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-white hover:text-red-500 border border-red-500"
                                >
                                    Supprimer
                                </button>
                            </>
                        )}
                        <button
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-white hover:text-gray-500 border border-gray-500"
                        >
                            Fermer
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
