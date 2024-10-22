import React, { useEffect, useState } from 'react';
import axiosInstance from '../helper/axios';
import { useTranslation } from 'react-i18next';

const UpcomingEvents = () => {
    const { t,i18n } = useTranslation(['home/upcomingEvents']); // Use translation from "home/upcomingEvents" namespace
    const [events, setEvents] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

    useEffect(() => {
        setSelectedLanguage(i18n.language);
    }, [i18n.language]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axiosInstance.get('/events');
                const fetchedEvents = response.data;

                // Fetch images for all events
                const eventsWithImages = await Promise.all(
                    fetchedEvents.map(async (event) => {
                        if (event.imagePath) {
                            try {
                                const imageResponse = await axiosInstance.get(`http://localhost:8087/api${event.imagePath}`, { responseType: 'blob' });
                                event.imageUrl = URL.createObjectURL(imageResponse.data);
                            } catch (error) {
                                console.error('Error fetching event image:', error);
                                event.imageUrl = "https://via.placeholder.com/400"; // Fallback image
                            }
                        } else {
                            event.imageUrl = "https://via.placeholder.com/400"; // Fallback image
                        }
                        event.title = event[`title_${selectedLanguage}`];
                        event.description = event[`description_${selectedLanguage}`];
                        return event;
                    })


                );

                setEvents(eventsWithImages);
            } catch (error) {
                console.error('Error fetching events', error);
            }
        };

        fetchEvents();
    }, [i18n.language, selectedLanguage]);

    return (
        <section className="bg-very-light-gray">
            <div className="container">
                <div className="section-heading">
                    <span className="sub-title">{t('upcomingEvents.subTitle')}</span>
                    <h2 className="h1 mb-0">{t('upcomingEvents.title')}</h2>
                </div>
                <div className="row g-xxl-5 mt-n2-9">
                    {events.map(event => (
                        <div className="col-xl-6 mt-2-9" key={event.id}>
                            <div className="row g-0 event-wrapper">
                                <div
                                    className="col-md-5 event-img bg-img cover-background"
                                    style={{ backgroundImage: `url(${event.imageUrl})` }}
                                ></div>
                                <div className="col-md-7">
                                    <div className="p-1-6 p-sm-1-9">
                                        <span className="badge-soft mb-3">{t('upcomingEvents.eventBadge')}</span>
                                        <h4 className="font-weight-800 h5 mb-3">
                                            {event.title}
                                        </h4>
                                        <p className="mb-3 alt-font font-weight-500">{event.description}</p>
                                        <div className="dotted-seprator pt-4 mt-4"></div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p className="mb-0 text-primary font-weight-600">
                                                <i className="ti-calendar me-2"></i><span className="text-primary">{new Date(event.date).toLocaleDateString()}</span>
                                            </p>
                                            <p className="mb-0 text-primary font-weight-600">
                                                <i className="ti-location-pin me-2"></i><span className="text-primary">{event.location}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UpcomingEvents;
