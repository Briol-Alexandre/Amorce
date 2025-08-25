import React, { useState } from "react";
import MainStructure from "@/Components/MainStructure.jsx";
import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import { usePage } from "@inertiajs/react";
import ActionButton from "@/Components/ActionButton.jsx";
import ModalEditUser from "@/Components/ModalEditUser.jsx";
import ModalDeleteUser from "@/Components/ModalDeleteUser.jsx";
import { Link } from "@inertiajs/react";

export default function Users({ users, permissions }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <MainStructure pageTitle={'Gestion des utilisateurs'}>
            <div className="flex-grow lg:p-3 py-2 flex flex-col items-center">
                <section className="w-full">
                <div className="mb-6">
                    <TitleAndSpan title={'Utilisateurs'} />
                </div>

                <div className="w-full overflow-x-auto mt-4">
                    <table className="border-collapse border border-gray-300 mx-auto lg:w-3/4 w-full text-center mb-20 max-lg:text-xs">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-400 lg:p-2 p-1 max-sm:hidden">Nom</th>
                                <th className="border border-gray-400 lg:p-2 p-1">Utilisateur</th>
                                <th className="border border-gray-400 lg:p-2 p-1 max-md:hidden">Permissions</th>
                                <th className="border border-gray-400 lg:p-2 p-1">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="border border-gray-400 lg:p-2 p-1 max-sm:hidden">{user.name}</td>
                                    <td className="border border-gray-400 lg:p-2 p-1">
                                        <div className="flex flex-col items-center">
                                            <span className="sm:hidden font-medium">{user.name}</span>
                                            <span className="text-gray-600">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="border border-gray-400 lg:p-2 p-1 max-md:hidden">
                                        <div className="flex flex-wrap gap-1 justify-center">
                                            {user.permissions.map((permission) => (
                                                <span
                                                    key={permission.id}
                                                    className="inline-block lg:px-2 lg:py-1 px-1 py-0.5 font-medium bg-gray-100 text-gray-800 rounded m-0.5"
                                                >
                                                    {permission.name}
                                                </span>
                                            ))}
                                            {user.permissions.length === 0 && (
                                                <span className="text-gray-500 italic inline-block lg:px-2 lg:py-1 px-1 py-0.5">
                                                    Aucune permission
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="border border-gray-400 lg:p-2 p-1">
                                        <div className="flex flex-col lg:flex-row justify-center gap-2">
                                            <ActionButton
                                                name="Modifier"
                                                color="orange"
                                                onClick={() => handleEditClick(user)}
                                            />
                                            <ActionButton
                                                name="Supprimer"
                                                color="red"
                                                onClick={() => handleDeleteClick(user)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                </section>
            </div>

            {/* Modals */}
            <ModalEditUser
                show={isEditModalOpen}
                onClose={closeEditModal}
                user={selectedUser}
                permissions={permissions}
            />
            <ModalDeleteUser
                show={isDeleteModalOpen}
                onClose={closeDeleteModal}
                user={selectedUser}
            />
        </MainStructure>
    );
}
