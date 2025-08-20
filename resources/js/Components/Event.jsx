import { useState } from "react";
import EventModal from "@/Components/EventModal";

export default function Event({ event }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const dateObj = event?.date ? new Date(event.date) : null;
    const day = dateObj ? dateObj.toLocaleDateString('fr-FR', { day: '2-digit' }) : '';
    const month = dateObj ? dateObj.toLocaleDateString('fr-FR', { month: 'short' }) : '';
    const time = event?.time ? event.time : '';

    const openModal = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    return (
        <>
            <article className="relative p-4 border rounded-lg mx-auto w-1/3">
                <a href="#" onClick={openModal} className="absolute top-0 left-0 right-0 bottom-0"><span className="sr-only">Voir les détails de l'événement</span></a>
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xl font-bold bg-black text-white text-center aspect-square w-16 rounded-lg flex items-center justify-center">
                            {day}<br />{month}
                        </span>
                        {time && (
                            <p className="text-sm text-center bg-gray-200 rounded-lg px-2 font-medium mt-1">{time}</p>
                        )}
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl">{event?.title}</h2>
                        <p className="text-base">{event?.description}</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                </div>
            </article>

            <EventModal
                event={event}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}