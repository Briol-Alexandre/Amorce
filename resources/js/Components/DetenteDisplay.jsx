import { useState } from "react";
import { DropIcon } from "./icons/DropIcon.jsx";
import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

export default function DetenteDisplay() {
    const { detenteParticipants = [] } = usePage().props;

    const [isRotated, setIsRotated] = useState(true);
    const toggleRotation = () => {
        setIsRotated(!isRotated);
    };

    return (
        <section className="mt-8">
            <div className='flex items-center gap-4 hover:cursor-pointer' onClick={toggleRotation}>
                <h3 className='small-title-style'>Détente actuelle</h3>
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
                <div className="bg-white rounded-lg shadow-md p-4">
                    {!detenteParticipants || detenteParticipants.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-gray-500">Aucun participant dans la détente actuellement.</p>
                            <Link
                                href={route('detente.index')}
                                className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800"
                            >
                                Voir la page détente
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {detenteParticipants.map((participant) => (
                                <div
                                    key={participant.id}
                                    className="bg-gray-50 rounded-lg p-3 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-medium">{participant.name}</p>
                                        <p className="text-sm">{participant.participation} {participant.participation > 1 ? 'participations' : 'participation'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
