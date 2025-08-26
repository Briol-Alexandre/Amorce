import React from 'react';
import Widget from './Widget';
import { router } from '@inertiajs/react';
import ProjetIcon from '@/Components/icons/ProjetIcon.jsx';

/**
 * 
 * @param {Object} props 
 * @param {Array} props.projects 
 * @returns {JSX.Element}
 */
export default function ProjectsWidget({ projects }) {
    return (
        <Widget
            title="Projets"
            color=""
            icon={<ProjetIcon className="w-5 h-5 inline" />}
            className="h-full"
        >
            <div className="space-y-4">
                {projects.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="p-3 bg-white rounded border border-gray-100 hover:bg-gray-50 cursor-pointer"
                                onClick={() => router.visit(route('project.show', project.id))}
                            >
                                <div className="flex items-center space-x-3">
                                    {project.image && (
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden aspect-square">
                                            <img
                                                src={project.image}
                                                alt={project.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/40?text=P';
                                                }}
                                            />
                                        </div>
                                    )}
                                    {!project.image && (
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <span className="text-gray-600 font-bold">
                                                {project.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div className="w-[80%] lg:w-[90%]">
                                        <h4 className="font-medium text-gray-800">{project.name}</h4>
                                        {project.description && (
                                            <p className="text-sm text-gray-500 truncate">
                                                {project.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">Aucun projet disponible</p>
                )}

                <div className="mt-3 text-center">
                    <button
                        onClick={() => router.visit(route('project.index'))}
                        className="text-sm text-gray-600 hover:text-gray-800"
                    >
                        Voir tous les projets
                    </button>
                </div>
            </div>
        </Widget>
    );
}
