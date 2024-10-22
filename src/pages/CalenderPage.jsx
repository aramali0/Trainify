import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axiosInstance from '../helper/axios';
import { getUser } from '../helper/auth';
import '../assets/css/calender.css';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const localizer = momentLocalizer(moment);

const CalendarPage = ({ path }) => {
    const { t, i18n } = useTranslation('pages/calenderPage'); // Add translation hooks
    const [events, setEvents] = useState([]);
    const id = getUser().userId;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const sectionsResponse = await axiosInstance.get(`${path}/${id}/sections`);
                const sessionsResponse = await axiosInstance.get(`${path}/${id}/sessions`);

                let combinedEvents = [
                    ...sectionsResponse.data.map(section => ({
                        id: section.id,
                        title: section.title,
                        start: new Date(section.startDate),
                        end: new Date(section.endDate),
                        allDay: true,
                        resource: 'Section'
                    })),
                    ...sessionsResponse.data.map(session => ({
                        id: session.id,
                        title: session.name,
                        start: new Date(session.startDate),
                        end: new Date(session.endDate),
                        allDay: true,
                        resource: 'Session'
                    }))
                ];

                if (path === '/participants') {
                    const unavailableResponse = await axiosInstance.get(`${path}/${id}/unavailability`);
                    combinedEvents = [
                        ...combinedEvents,
                        ...unavailableResponse.data.map(unavailable => ({
                            id: unavailable.id,
                            title: t('Unavailable'), // Use translation
                            start: new Date(unavailable.startDate),
                            end: new Date(unavailable.endDate),
                            allDay: true,
                            resource: 'Unavailable'
                        }))
                    ];
                } else if (path === '/responsables') {
                    const participantsUnavailabilityResponse = await axiosInstance.get(`${path}/${id}/unavailability`);
                    console.log("from the responsables" + participantsUnavailabilityResponse.data);
                    combinedEvents = [
                        ...combinedEvents,
                        ...participantsUnavailabilityResponse.data.map(unavailable => ({
                            id: unavailable.id,
                            title: `${unavailable.participantName} (${t('Unavailable')})`, // Use translation
                            start: new Date(unavailable.startDate),
                            end: new Date(unavailable.endDate),
                            allDay: true,
                            resource: 'Unavailable'
                        }))
                    ];
                }

                setEvents(combinedEvents);
            } catch (error) {
                console.error(t('Failed to fetch events'), error); // Use translation
            }
        };

        fetchEvents();
    }, [id, path, t]); // Add t to dependencies

    const handleSelectSlot = async ({ start, end }) => {
        if (path === '/participants') {
            try {
                const response = await axiosInstance.post(`${path}/${id}/unavailability`, {
                    startDate: start.toISOString(),
                    endDate: end.toISOString()
                });

                const newEvent = {
                    id: response.data.id,
                    title: t('Unavailable'), // Use translation
                    start: new Date(response.data.startDate),
                    end: new Date(response.data.endDate),
                    allDay: true,
                    resource: 'Unavailable'
                };

                setEvents([...events, newEvent]);
            } catch (error) {
                console.error(t('Failed to submit unavailable time'), error); // Use translation
            }
        }
    };

    const handleSelectEvent = async (event) => {
        if (event.resource === 'Unavailable' && path === '/participants') {
            try {
                await axiosInstance.delete(`${path}/${id}/unavailability/${event.id}`);

                setEvents(events.filter(e => e.id !== event.id));
            } catch (error) {
                console.error(t('Failed to delete unavailable time'), error); // Use translation
            }
        }
    };

    return (
        <div className={`p-6 bg-gray-100 ${i18n.language === 'ar' ? 'text-right' : ''}`}>
            <h1 className="text-3xl font-bold mb-4 text-gray-800">{t('Calendar')}</h1>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    selectable={path === '/participants'}
                    style={{ height: 600 }}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={(event) => {
                        let backgroundColor;
                        if (event.resource === 'Section') {
                            backgroundColor = '#f39c12'; // Yellow for sections
                        } else if (event.resource === 'Session') {
                            backgroundColor = '#3498db'; // Blue for sessions
                        } else if (event.resource === 'Unavailable') {
                            backgroundColor = '#e74c3c'; // Red for unavailable times
                        }
                        return { style: { backgroundColor } };
                    }}
                />
            </div>
        </div>
    );
};

export default CalendarPage;
