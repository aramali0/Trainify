import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../helper/axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const EventListPage = () => {
    const { t } = useTranslation('pages/eventList'); // Initialize the translation hook
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get('/events')
            .then(async (response) => {
                const fetchedEvents = response.data;
                if (Array.isArray(fetchedEvents)) {
                    const eventsWithImages = await Promise.all(
                        fetchedEvents.map(async (event) => {
                            if (event.imagePath) {
                                try {
                                    const imageResponse = await axiosInstance.get(`http://localhost:8087/api${event.imagePath}`, { responseType: 'blob' });
                                    event.imageUrl = URL.createObjectURL(imageResponse.data);
                                } catch (error) {
                                    console.error('Error fetching event image:', error);
                                    event.imageUrl = "https://via.placeholder.com/400";
                                }
                            } else {
                                event.imageUrl = "https://via.placeholder.com/400";
                            }
                            return event;
                        })
                    );
                    setEvents(eventsWithImages);
                } else {
                    setEvents([]);
                }
            })
            .catch(error => console.error('Error fetching events:', error));
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(t('confirmDelete')); // Use translation for confirmation
        if (confirmDelete) {
            try {
                await axiosInstance.delete(`/events/${id}`);
                setEvents(events.filter(event => event.id !== id));
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    };

    const handleCreate = () => {
        navigate('/admin/create-event');
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">{t('eventList')}</h2> {/* Translated Title */}
                <button
                    onClick={handleCreate}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                >
                    {t('createEvent')} {/* Translated Button */}
                </button>
            </div>
            {events.length === 0 ? (
                <p className="text-center text-gray-600">{t('noEvents')}</p> // Translated No Events Message
            ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {events.map(event => (
                        <div
                            key={event.id}
                            className="bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-300 transform hover:scale-105"
                        >
                            <div className="relative">
                                <img
                                    src={event.imageUrl || "https://via.placeholder.com/400"}
                                    alt={event.title}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => e.target.src = "https://via.placeholder.com/400"}  // Fallback
                                />
                                <div className="absolute top-2 right-2 flex space-x-2">
                                    {/* <FaEdit
                                        onClick={() => navigate(`/admin/update-event/${event.id}`)}
                                        className="text-blue-500 hover:text-blue-600 cursor-pointer"
                                        size={20}
                                    /> */}
                                    <FaTrashAlt
                                        onClick={() => handleDelete(event.id)}
                                        className="text-red-500 hover:text-red-600 cursor-pointer"
                                        size={20}
                                    />
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-800 truncate">{event.title}</h3>
                                <p className="text-gray-600 text-sm truncate"><strong>{t('date')}</strong> {new Date(event.date).toLocaleDateString()}</p>
                                <p className="text-gray-600 text-sm truncate"><strong>{t('location')}</strong> {event.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventListPage;
