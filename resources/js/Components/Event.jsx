import { useState } from "react";
import EventModal from "@/Components/EventModal";
import { usePage } from "@inertiajs/react";

export default function Event({ event }) {
    const { users } = usePage().props;
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
            <article className="relative p-2 lg:p-4 border rounded-lg mx-auto lg:w-1/3 md:w-1/2 max-md:w-full max-md:mb-3">
                <a href="#" onClick={openModal} className="absolute top-0 left-0 right-0 bottom-0 w-full h-full z-10"><span className="sr-only">Voir les détails de l'événement</span></a>
                <div className="flex items-center justify-between relative">
                    <div>
                        <span className="md:text-xl font-bold bg-black text-white text-center aspect-square md:w-16 w-14 rounded-lg flex items-center justify-center">
                            {day}<br />{month}
                        </span>
                        {time && (
                            <p className="md:text-sm text-xs text-center bg-gray-200 rounded-lg px-2 font-medium mt-1">{time}</p>
                        )}
                    </div>
                    <div className="text-center flex-1 mx-4">
                        <h2 className="md:text-xl">{event?.title}</h2>
                        <p className="md:text-base text-xs max-md:max-w-[100px] md:w-3/4 md:mx-auto overflow-hidden line-clamp-2">{event?.description}</p>
                    </div>
                    <div className="flex items-center justify-center min-w-10">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 md:size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </div>
                </div>
            </article>

            <EventModal
                event={event}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                users={users}
            />
        </>
    );
}