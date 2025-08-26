import React, { useState } from 'react';
import Widget from './Widget';
import { router } from '@inertiajs/react';
import EventIcon from '@/Components/icons/EventIcon.jsx';
import EventModal from '@/Components/EventModal';

/**
 * 
 * @param {Object} props 
 * @param {Array} props.events
 * @returns {JSX.Element}
 */
export default function EventsWidget({ events }) {
    const [openModalId, setOpenModalId] = useState(null);
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

    const openModal = (eventId, e) => {
        e.preventDefault();
        setOpenModalId(eventId);
    };

    return (
        <Widget
            title="Événements à venir"
            color=""
            icon={<EventIcon className="w-5 h-5 inline" />}
            className="h-full"
        >
            <div className="space-y-4">
                {sortedEvents.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {sortedEvents.slice(0, 5).map((event) => {
                            const dateObj = event?.date ? new Date(event.date) : null;
                            const day = dateObj ? dateObj.toLocaleDateString('fr-FR', { day: '2-digit' }) : '';
                            const month = dateObj ? dateObj.toLocaleDateString('fr-FR', { month: 'short' }) : '';
                            const time = dateObj ? dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';

                            return (
                                <React.Fragment key={event.id}>
                                    <article className="relative p-2 border border-gray-200 rounded-lg w-full">
                                        <a href="#" onClick={(e) => openModal(event.id, e)} className="absolute top-0 left-0 right-0 bottom-0 w-full h-full z-10">
                                            <span className="sr-only">Voir les détails de l'événement</span>
                                        </a>
                                        <div className="flex items-center justify-between relative">
                                            <div>
                                                <span className="text-sm md:text-base font-bold bg-black text-white text-center aspect-square w-12 rounded-lg flex items-center justify-center">
                                                    {day}<br />{month}
                                                </span>
                                                {time && (
                                                    <p className="text-xs text-center bg-gray-200 rounded-lg px-2 font-medium mt-1">{time}</p>
                                                )}
                                            </div>
                                            <div className="text-center flex-1 mx-4">
                                                <h2 className="text-sm md:text-base font-medium">{event?.title}</h2>
                                                <p className="text-xs overflow-hidden line-clamp-1 text-gray-500">{event?.description}</p>
                                            </div>
                                            <div className="flex items-center justify-center min-w-8">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </article>

                                    {openModalId === event.id && (
                                        <EventModal
                                            event={event}
                                            isOpen={openModalId === event.id}
                                            onClose={() => setOpenModalId(null)}
                                            users={[]}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">Aucun événement à venir</p>
                )}

                <div className="mt-3 text-center">
                    <button
                        onClick={() => router.visit(route('events.index'))}
                        className="text-sm text-gray-600 hover:text-gray-800"
                    >
                        Voir tous les événements
                    </button>
                </div>
            </div>
        </Widget>
    );
}
