import React, { useState } from 'react';
import EventDisplay from './EventDisplay';
import CalendarDisplay from './CalendarDisplay';

export default function EventManager() {
    const [activeView, setActiveView] = useState('list'); // 'list' ou 'calendar'

    const toggleView = () => {
        setActiveView(activeView === 'list' ? 'calendar' : 'list');
    };

    return (
        <div className="event-manager">
            <div className="flex justify-between items-center mb-4">
                <h2 className="small-title-style">Événements</h2>
                <button 
                    onClick={toggleView}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title={activeView === 'list' ? "Afficher le calendrier" : "Afficher la liste"}
                >
                    {activeView === 'list' ? (
                        /* Icône de calendrier pour passer à la vue calendrier */
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    ) : (
                        /* Icône de liste pour passer à la vue liste */
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {activeView === 'list' ? (
                <EventDisplay />
            ) : (
                <CalendarDisplay />
            )}
        </div>
    );
}
