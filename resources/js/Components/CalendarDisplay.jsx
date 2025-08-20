import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { route } from "ziggy-js";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import fr from 'date-fns/locale/fr';
// import { Transition } from '@headlessui/react'; // Plus nécessaire
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../css/calendar-custom.css';

const locales = {
    'fr': fr,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => {
        return startOfWeek(new Date(), { locale: fr });
    },
    getDay,
    locales,
});

// Formats personnalisés pour l'affichage des dates
const formats = {
    timeGutterFormat: (date, culture, localizer) =>
        localizer.format(date, 'HH:mm', culture),
    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
        localizer.format(start, 'HH:mm', culture) + ' – ' +
        localizer.format(end, 'HH:mm', culture),
    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
        localizer.format(start, 'dd MMMM', culture) + ' – ' +
        localizer.format(end, 'dd MMMM', culture),
    monthHeaderFormat: (date, culture, localizer) =>
        localizer.format(date, 'MMMM yyyy', culture).charAt(0).toUpperCase() +
        localizer.format(date, 'MMMM yyyy', culture).slice(1),
};

// Composant personnalisé pour la barre d'outils
const CustomToolbar = ({ label, onNavigate, onView }) => {
    return (
        <div className="rbc-toolbar">
            <span className="rbc-btn-group">
                <button type="button" onClick={() => onNavigate('PREV')}>Précédent</button>
                <button type="button" onClick={() => onNavigate('TODAY')}>Aujourd'hui</button>
                <button type="button" onClick={() => onNavigate('NEXT')}>Suivant</button>
            </span>
            <span className="rbc-toolbar-label">{label}</span>
            <span></span> {/* Espace vide pour maintenir l'alignement */}
        </div>
    );
};

export default function CalendarDisplay() {
    const [selectedDate, setSelectedDate] = useState(null);
    const { events = [] } = usePage().props;

    const calendarEvents = events ? events.map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.date),
        end: new Date(event.date),
        description: event.description,
        status: event.status || 'default'
    })) : [];

    const eventStyleGetter = (event) => {
        const style = {
            backgroundColor: getStatusColor(event.status),
            borderRadius: '5px',
            opacity: 0.8,
            color: '#1F2937',
            border: '0',
            display: 'block'
        };
        return {
            style
        };
    };

    const getStatusColor = (status) => {
        const colors = {
            'default': '#93c5fd',  // blue-300
            'important': '#fcd34d', // amber-300
            'urgent': '#f87171',    // red-400
            'completed': '#86efac'  // green-300
        };
        return colors[status] || '#d1d5db';
    };

    // Fonction pour filtrer les événements du jour sélectionné
    const getEventsForSelectedDate = () => {
        if (!selectedDate) return [];

        return calendarEvents.filter(event => {
            const eventDate = new Date(event.start);
            const selected = new Date(selectedDate);

            return eventDate.getFullYear() === selected.getFullYear() &&
                eventDate.getMonth() === selected.getMonth() &&
                eventDate.getDate() === selected.getDate();
        });
    };

    // Fonction pour formater la date sélectionnée
    const formatSelectedDate = () => {
        if (!selectedDate) return '';

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(selectedDate).toLocaleDateString('fr-FR', options);
    };

    // Fonction pour ouvrir la modale de création d'événement
    const handleAddEvent = () => {
        // Redirection vers la page de création d'événement avec la date pré-remplie
        router.visit(route('event.create', { date: selectedDate ? format(new Date(selectedDate), 'yyyy-MM-dd') : '' }));
    };

    return (
        <div className="calendar-container">
            <h2 className="small-title-style mb-4">Calendrier</h2>

            <div className="h-[500px]">
                <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    eventPropGetter={eventStyleGetter}
                    formats={formats}
                    culture="fr"
                    views={['month']}
                    defaultView={'month'}
                    messages={{
                        next: 'Suivant',
                        previous: 'Précédent',
                        today: 'Aujourd\'hui',
                        month: 'Mois',
                        noEventsInRange: 'Aucun événement sur cette période',
                        showMore: (total) => `+${total} autres`,
                    }}
                    components={{
                        toolbar: CustomToolbar
                    }}
                    onSelectEvent={(event) => {
                        // Redirection vers la page de détail de l'événement si nécessaire
                        // window.location = route('event.show', event.id);
                    }}
                    onSelectSlot={({ start }) => {
                        setSelectedDate(start);
                    }}
                    selectable={true}
                />
            </div>

            {/* Section des événements du jour sélectionné */}
            {selectedDate && (
                <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Événements du {formatSelectedDate()}</h3>
                        <button
                            onClick={handleAddEvent}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Ajouter un événement
                        </button>
                    </div>

                    <div className="space-y-3">
                        {getEventsForSelectedDate().length > 0 ? (
                            getEventsForSelectedDate().map(event => (
                                <div
                                    key={event.id}
                                    className="p-3 border-l-4 bg-gray-50 rounded-md flex justify-between items-center"
                                    style={{ borderLeftColor: getStatusColor(event.status) }}
                                >
                                    <div>
                                        <h4 className="font-medium">{event.title}</h4>
                                        {event.description && (
                                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">Aucun événement pour cette date.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}