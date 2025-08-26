import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import { router, usePage, Link } from "@inertiajs/react";
import MainStructure from "@/Components/MainStructure.jsx";
import React, { useState } from "react";

export default function Draw() {
    const { drawParticipants, detenteParticipants } = usePage().props;
    const [selectedParticipants, setSelectedParticipants] = useState([]);

    function removeParticipant(donatorId, name, source) {
        router.post(route('detente.remove'), {
            donator_id: donatorId,
            name: name,
            source: source
        });
    }

    const handleCheckboxChange = (donatorId, name, isChecked) => {
        if (isChecked) {
            setSelectedParticipants([...selectedParticipants, { id: donatorId, name }]);
        } else {
            setSelectedParticipants(selectedParticipants.filter(participant => participant.id !== donatorId));
        }
    };

    const handleRemoveSelected = () => {
        selectedParticipants.forEach((participant) => {
            removeParticipant(participant.id, participant.name, 'draw');
        });
        setSelectedParticipants([]);
    };

    function performDraw() {
        router.get(route('detente.perform-draw'));
    }

    function removeParticipants() {
        router.post(route('detente.remove-all'));
    }

    return (
        <MainStructure pageTitle={'Tirage Détente'}>
            <section className={"flex-grow lg:p-3 py-3"}>
                <TitleAndSpan onClick={() => router.visit(route('detente.draw'))} title={'Tirage'} />
                <div className="flex lg:flex-row max-lg:flex-col max-lg:gap-4 justify-between items-center mt-4 lg:mx-8 max-lg:mx-2 mb-6">
                    <div className="text-gray-700 max-lg:text-sm">
                        <span className="font-medium">{drawParticipants.length}</span> participant(s) dans le tirage |
                        <span className="font-medium ml-2">{detenteParticipants.length}</span> participant(s) dans la détente
                    </div>
                    <div className="lg:space-x-4 max-lg:flex max-lg:flex-col max-lg:gap-2 max-lg:w-full">
                        <Link
                            href={route('detente.index')}
                            className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 max-lg:w-full max-lg:text-center max-lg:text-sm'
                        >
                            Ajouter des participants
                        </Link>
                        <Link
                            href={route('detente.history')}
                            className='bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 max-lg:w-full max-lg:text-center max-lg:text-sm'
                        >
                            Voir l'historique
                        </Link>
                    </div>
                </div>
                <section className="mb-8 lg:mx-8 max-lg:mx-2">
                    <div className="flex lg:flex-row max-lg:flex-col max-lg:gap-3 justify-between">
                        <h2 className="lg:text-xl max-lg:text-lg font-semibold mb-4">Liste des participants au tirage</h2>
                        <div className="flex gap-2">
                            {selectedParticipants.length > 0 ? (
                                <button
                                    className='bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 max-lg:w-full max-lg:text-center max-lg:text-sm'
                                    onClick={handleRemoveSelected}
                                >
                                    Retirer {selectedParticipants.length} sélectionné(s)
                                </button>
                            ) : (
                                <button
                                    className='bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 max-lg:w-full max-lg:text-center max-lg:text-sm'
                                    onClick={() => removeParticipants()}
                                >
                                    Retirer tous les participants
                                </button>
                            )}
                        </div>
                    </div>

                    {drawParticipants.length > 0 ? (
                        <div className='flex flex-col'>
                            <div className="w-full overflow-x-auto mt-2">
                                <table className="border-collapse border border-gray-300 w-full text-center">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border border-gray-400 p-2 w-[90%]">Nom</th>
                                            <th className="border border-gray-400 p-2 w-[10%]">
                                                <span className="flex items-center justify-center">
                                                    <span>Sélectionner</span>
                                                    <input
                                                        type="checkbox"
                                                        className="w-5 h-5 ml-4 text-blue-600 rounded focus:ring-blue-500"
                                                        onChange={(e) => e.target.checked
                                                            ? setSelectedParticipants(drawParticipants.map(participant => ({ id: participant.donator_id, name: participant.name })))
                                                            : setSelectedParticipants([])}
                                                    />
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {drawParticipants.map((participant) => (
                                            <tr key={participant.donator_id} className="hover:bg-gray-50">
                                                <td className="border border-gray-400 p-2 text-left w-4/5">
                                                    <p className="font-medium max-lg:text-sm">{participant.name}</p>
                                                </td>
                                                <td className="border border-gray-400 p-2 w-1/5">
                                                    <div className="flex justify-center items-center">
                                                        <input
                                                            type="checkbox"
                                                            id={`participant-${participant.donator_id}`}
                                                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                                            onChange={(e) => handleCheckboxChange(participant.donator_id, participant.name, e.target.checked)}
                                                            checked={selectedParticipants.some(p => p.id === participant.donator_id)}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className='flex justify-center mt-4'>
                                <button
                                    className='bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 font-medium max-lg:text-sm max-lg:w-full'
                                    onClick={performDraw}
                                    disabled={drawParticipants.length === 0}
                                >
                                    Effectuer le tirage
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 max-lg:text-sm">Aucun participant dans le tirage. Ajoutez des participants depuis la page Détente.</p>
                    )}
                </section>
                <section className="mb-8 lg:mx-8 max-lg:mx-2">
                    <h2 className="lg:text-xl max-lg:text-lg font-semibold mb-4">Participants actuels de la détente</h2>
                    {detenteParticipants.length > 0 ? (
                        <div className='flex flex-col'>
                            <ul className='w-full mt-2 border border-gray-200 rounded-md overflow-hidden'>
                                {detenteParticipants.map((participant) => (
                                    <li className='border-b last:border-b-0 p-3 flex justify-between items-center bg-white hover:bg-gray-50' key={participant.donator_id}>
                                        <div>
                                            <p className="font-medium max-lg:text-sm">{participant.name}</p>
                                            <p className="lg:text-sm max-lg:text-xs text-gray-500">Participations: {participant.participation}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 max-lg:text-xs'
                                                onClick={() => removeParticipant(participant.donator_id, participant.name, 'detente')}
                                            >
                                                Retirer
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-gray-500 max-lg:text-sm">Aucun participant dans la détente actuelle.</p>
                    )}
                </section>
            </section>
        </MainStructure>
    )
}
