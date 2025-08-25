import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { AddIcon } from "@/Components/icons/AddIcon.jsx";
import { usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import Modal from "@/Components/Modal.jsx";
import NewFund from "@/Components/NewFund.jsx";
import NewEvent from "@/Components/NewEvent.jsx";
import NewProject from "@/Components/NewProject.jsx";

export default function TitleAndSpan({ title, onClick }) {
    const { funds } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const auth = usePage().props.auth;

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (<>
        <div className="flex justify-between">
            <h2 className="title-style hover:cursor-pointer"
                onClick={onClick}>{title}</h2>
            {title === 'Compte' && auth.user && auth.user.permissions && auth.user.permissions.includes('create-users') && (
                <Link href='/users' className="bg-black text-white p-2 rounded hover:bg-white hover:text-black border border-black
                                   text-xs lg:text-base">
                    Gérer les utilisateurs
                </Link>
            )
            }
            {title === 'Utilisateurs' && auth.user && auth.user.permissions && auth.user.permissions.includes('create-users') && (
                <Link
                    href={route('compte.create')}
                    className="bg-black text-white p-2 rounded hover:bg-white hover:text-black border border-black text-xs lg:text-base"
                >
                    Ajouter un nouvel utilisateur
                </Link>
            )
            }
            {title.includes('Fonds') && auth.user && auth.user.permissions && auth.user.permissions.includes('manage-funds') && (
                <button onClick={openModal} className="bg-black text-white p-2 rounded hover:bg-white hover:text-black border border-black
                                   text-xs lg:text-base">
                    Ajouter un fond
                </button>
            )
            }
            {title === 'Détente' && auth.user && auth.user.permissions && auth.user.permissions.includes('manage-detente') && (
                <Link
                    href="/history"
                    className="bg-black text-white p-2 rounded hover:bg-white hover:text-black border border-black
                                   text-xs lg:text-base"
                >
                    Accéder à la détente
                </Link>
            )}
            {title === 'Événements' && auth.user && auth.user.permissions && auth.user.permissions.includes('manage-meetings') && (
                <button
                    onClick={openModal}
                    className="bg-black text-white p-2 rounded hover:bg-white hover:text-black border border-black
                                   text-xs lg:text-base"
                >
                    Créer un événement
                </button>
            )}
            {title === 'Projets' && auth.user && auth.user.permissions && auth.user.permissions.includes('manage-projects') && (
                <button
                    onClick={openModal}
                    className="bg-black text-white p-2 rounded hover:bg-white hover:text-black border border-black
                                   text-xs lg:text-base"
                >
                    Ajouter un projet
                </button>
            )}
        </div>
        <span className="block h-0.5 bg-gray-300 mt-1.5"></span>
        <Modal show={isModalOpen} onClose={closeModal}>
            {title.includes('Fonds') && auth.user && auth.user.permissions && auth.user.permissions.includes('manage-funds') && <NewFund onClose={closeModal} />}
            {title === 'Événements' && auth.user && auth.user.permissions && auth.user.permissions.includes('manage-events') && <NewEvent onClose={closeModal} />}
            {title === 'Projets' && auth.user && auth.user.permissions && auth.user.permissions.includes('manage-projects') && <NewProject onClose={closeModal} />}
        </Modal>
    </>);
}
