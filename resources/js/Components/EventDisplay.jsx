import Event from "./Event.jsx";
import { useState } from "react";
import { DropIcon } from "./icons/DropIcon.jsx";
import { usePage } from "@inertiajs/react";

export default function EventDisplay() {
    const { events = [] } = usePage().props;

    const [isRotated, setIsRotated] = useState(true);
    const toggleRotation = () => {
        setIsRotated(!isRotated);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parsedEvents = Array.isArray(events)
        ? events
            .map((e) => ({ ...e, _date: new Date(e.date) }))
            .filter((e) => !isNaN(e._date))
        : [];

    const upcoming = parsedEvents
        .filter((e) => e._date >= today)
        .sort((a, b) => a._date - b._date);

    const past = parsedEvents
        .filter((e) => e._date < today)
        .sort((a, b) => b._date - a._date);

    return (
        <>
            <section>
                <div className='flex items-center gap-4 hover:cursor-pointer' onClick={toggleRotation}>
                    <h3 className='small-title-style'>Evénements à venir</h3>
                    <span className="block h-0.5 bg-gray-300 mt-1.5 ml-2 flex-grow"></span>
                    <div
                        className={isRotated ? 'rotate-0 transition duration-100' : 'rotate-180 transition duration-100'}
                    >
                        <DropIcon />
                    </div>
                </div>
                <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isRotated
                        ? 'max-h-[1000px] opacity-100 mt-4'
                        : 'max-h-0 opacity-0 mt-0'
                        }`}
                >
                    <div className="space-y-4">
                        {upcoming.length === 0 && (
                            <p className="text-sm text-gray-500">Aucun événement à venir.</p>
                        )}
                        {upcoming.map((e) => (
                            <Event key={e.id} event={e} />
                        ))}
                    </div>
                </div>
            </section>
            <section className="mt-5">
                <div className='flex items-center gap-4 hover:cursor-pointer' onClick={toggleRotation}>
                    <h3 className='small-title-style'>Evénements passés</h3>
                    <span className="block h-0.5 bg-gray-300 mt-1.5 ml-2 flex-grow"></span>
                    <div
                        className={isRotated ? 'rotate-0 transition duration-100' : 'rotate-180 transition duration-100'}
                    >
                        <DropIcon />
                    </div>
                </div>
                <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isRotated
                        ? 'max-h-[1000px] opacity-100 mt-4'
                        : 'max-h-0 opacity-0 mt-0'
                        }`}
                >
                    <div className="space-y-4">
                        {past.length === 0 && (
                            <p className="text-sm text-gray-500">Aucun événement passé.</p>
                        )}
                        {past.map((e) => (
                            <Event key={e.id} event={e} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}