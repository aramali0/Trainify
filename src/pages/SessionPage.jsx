// src/pages/SessionsPage.js
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import SessionCard from '../components/SessionCard';
import { getUser } from '../helper/auth';
import dayjs from 'dayjs'; // To handle date comparison
import { useTranslation } from 'react-i18next';

const SessionsPage = ({ path, nom }) => {
    const [sessions, setSessions] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // State to manage filter
    const { courseId } = useParams(); // Extract courseId from the URL parameters
    const id = getUser().userId;
    const { t } = useTranslation('pages/sessionPage');

    useEffect(() => {
        const fetchSessions = async () => {
            console.log("Fetching sessions: path:", path);
           try {
                let response;
                if (courseId) {
                    // Fetch sessions for a specific course
                    response = await axiosInstance.get(`/cours/${courseId}/sessions`);
                } else {
                    console.log("Fetching sessions by participant: path:", path);
                    
                    // Fetch all sessions
                    response = await axiosInstance.get(`${path}/${id}/sessions`);
                }
                setSessions(response.data);
                setFilteredSessions(response.data); // Initialize filtered sessions with all data
                setIsLoading(false);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    toast.error(t("errors.noSessionsAvailable"));
                }
                else {
                    toast.error(t("errors.failedToLoadSessions"));
                }
                setIsLoading(false);
            }
        };

        fetchSessions();
    }, [courseId]);

    // Filter logic
    useEffect(() => {
        if (filter === 'future') {
            setFilteredSessions(sessions.filter(session => dayjs(session.startDate).isAfter(dayjs())));
        } else if (filter === 'past') {
            setFilteredSessions(sessions.filter(session => dayjs(session.endDate).isBefore(dayjs())));
        } else if (filter === 'ongoing') {
            setFilteredSessions(sessions.filter(session =>
                dayjs(session.startDate).isBefore(dayjs()) && dayjs(session.endDate).isAfter(dayjs())
            ));
        } else {
            setFilteredSessions(sessions); // Show all sessions
        }
    }, [filter, sessions]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-100">
            <div className='flex justify-between mb-4'>
                <h1 className="text-4xl font-bold text-gray-800 mb-6">{t("titles.sessions")}</h1>
                {
                    (nom === "/responsable" || nom === "/charge-formation") && (
                        <Link to={`${nom}/sessions/add`} className="mb-6 px-2 py-1 text-base md:text-lg md:px-4 md:py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            {t("buttons.createSession")}
                        </Link>
                    )
                }
            </div>

            {/* Filter Buttons */}
            <div className="mb-6 flex flex-wrap gap-2 justify-center md:justify-start">
                <button
                    className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleFilterChange('all')}
                >
                    {t("filters.allSessions")}
                </button>
                <button
                    className={`px-4 py-2 rounded ${filter === 'future' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleFilterChange('future')}
                >
                    {t("filters.futureSessions")}
                </button>
                <button
                    className={`px-4 py-2 rounded ${filter === 'past' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleFilterChange('past')}
                >
                    {t("filters.pastSessions")}
                </button>
                <button
                    className={`px-4 py-2 rounded ${filter === 'ongoing' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleFilterChange('ongoing')}
                >
                    {t("filters.ongoingSessions")}
                </button>
            </div>

            {isLoading ? (
                <div>{t("messages.loading")}</div>
            ) : filteredSessions.length === 0 ? (
                <div className="text-center text-gray-500">
                    <p>{t("messages.noSessionsAvailable")}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSessions.map(session => (
                        <SessionCard nom={nom} key={session.id} session={session} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SessionsPage;
