import React, { useState } from "react";
import Modal from "@/Components/Modal.jsx";
import ShowProject from "@/Components/ShowProject.jsx";
import EditProject from "@/Components/EditProject.jsx";

export default function ProjectList({ projects }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalKey, setModalKey] = useState(0);
    const [selectedProject, setSelectedProject] = useState(null);
    const [modalMode, setModalMode] = useState('show'); // 'show' ou 'edit'

    const openModal = (project, mode = 'show') => {
        setSelectedProject(project);
        setModalMode(mode);
        setModalKey(prevKey => prevKey + 1);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleEditClick = () => {
        setModalMode('edit');
    };

    return (
        <>
            <div className="w-full mt-4 px-4">
                <div className="hidden md:block overflow-x-auto">
                    <table className="border-collapse border border-gray-300 mx-auto w-4xl text-center mb-20 ">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-400 p-2 w-1/5">Nom du projet / association</th>
                                <th className="border border-gray-400 p-2 w-4/5">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-400 p-2">
                                        <button
                                            onClick={() => openModal(project, 'show')}
                                            className="w-full hover:bg-gray-100 rounded-md transition duration-200"
                                        >
                                            <div className="flex justify-start items-center gap-2">
                                                {project.image ? (
                                                    <img src={project.image} alt={project.name} className="w-16 h-16 object-cover rounded-full" />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <span className="text-gray-600 font-medium">{project.name.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                )}
                                                <span className="ml-2">{project.name}</span>
                                            </div>
                                        </button>
                                    </td>
                                    <td className={`border border-gray-400 p-2 ${project.description ? 'bg-green-300/20' : 'bg-red-300/20'}`}>
                                        <span className="inline-block px-2 py-1 font-medium">
                                            {project.description}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden space-y-4 mb-20">
                    {projects.map((project, index) => (
                        <div key={index} className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                            <button
                                onClick={() => openModal(project, 'show')}
                                className="w-full text-left hover:bg-gray-50 transition duration-200"
                            >
                                <div className="p-4 flex items-center gap-3">
                                    {project.image ? (
                                        <img src={project.image} alt={project.name} className="w-12 h-12 object-cover rounded-full" />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-gray-600 font-medium">{project.name.charAt(0).toUpperCase()}</span>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-medium">{project.name}</h3>
                                        <p className={`text-sm mt-1 ${project.description ? 'text-gray-600' : 'text-gray-400 italic'}`}>
                                            {project.description || 'Aucune description'}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <Modal key={modalKey} show={isModalOpen} onClose={closeModal} className="project-modal-wide">
                {selectedProject && modalMode === 'show' && (
                    <ShowProject
                        project={selectedProject}
                        onClose={closeModal}
                        onEdit={handleEditClick}
                    />
                )}
                {selectedProject && modalMode === 'edit' && (
                    <EditProject
                        project={selectedProject}
                        onClose={closeModal}
                    />
                )}
            </Modal>
        </>
    );
}