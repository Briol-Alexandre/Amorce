import React from 'react';
import Widget from './Widget';
import { router } from '@inertiajs/react';
import DetenteIcon from '@/Components/icons/DetenteIcon.jsx';

/**
 * Widget affichant les informations sur la détente
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {Array} props.participants - Liste des participants à la détente
 * @param {number} props.participantCount - Nombre total de participants
 * @param {number} props.maxParticipants - Nombre maximum de participants
 * @returns {JSX.Element}
 */
export default function DetenteWidget({ participants, participantCount, maxParticipants = 9 }) {
    return (
        <Widget
            title="Détente"
            color=""
            icon={<DetenteIcon className="w-5 h-5 inline" />}
            className="h-full"
        >
            <div className="space-y-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Participants</p>
                    <div className="flex items-center">
                        <p className="text-xl font-bold text-green-600">{participantCount}</p>
                        <p className="text-gray-400 ml-1">/ {maxParticipants}</p>
                    </div>
                </div>

                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Participants actuels</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {participants.length > 0 ? (
                            participants.map((participant) => (
                                <div
                                    key={participant.id}
                                    className="p-2 bg-white rounded border border-gray-100 flex justify-between items-center"
                                >
                                    <span className="font-medium">{participant.name}</span>
                                    <span className="text-gray-500 text-sm">
                                        {participant.participation} participation{participant.participation > 1 ? 's' : ''}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm italic">Aucun participant actuellement</p>
                        )}
                    </div>

                    <div className="mt-3 text-center">
                        <button
                            onClick={() => router.visit(route('detente.index'))}
                            className="text-sm text-green-600 hover:text-green-800"
                        >
                            Voir la détente
                        </button>
                    </div>
                </div>
            </div>
        </Widget>
    );
}
