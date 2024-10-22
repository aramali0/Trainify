import React, { useState, useEffect } from 'react';
import axiosInstance from '../helper/axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'tailwindcss/tailwind.css';
import { useTranslation } from 'react-i18next';

const ConferencePage = () => {
    const { sessionId } = useParams();
    const [conference, setConference] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState('');
    const { t } = useTranslation('pages/conferencePage');

    useEffect(() => {
        const fetchConference = async () => {
            try {
                const response = await axiosInstance.get(`/video-conferences/session/${sessionId}`);
                const conferenceData = response.data[0];
                setConference(conferenceData);
                const startTime = new Date(conferenceData?.startTime).getTime();
                updateTimeRemaining(startTime);
                const interval = setInterval(() => updateTimeRemaining(startTime), 1000);
                return () => clearInterval(interval);
            } catch (error) {
                console.log('Failed to fetch conference:', error);
                toast.error(t("conference.loadError"));
            }
        };

        const updateTimeRemaining = (startTime) => {
            const now = Date.now();
            const timeDiff = startTime - now;

            if (timeDiff > 0) {
                const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

                setTimeRemaining(
                    `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
                );
            } else {
                setTimeRemaining(t("conference.started"));
            }
        };

        fetchConference();
    }, [sessionId]);

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl rounded-xl">
            <div className="p-8 bg-white shadow-lg rounded-lg border border-gray-200 transition-transform transform hover:scale-105 duration-300">
                {conference ? (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-4xl font-bold mb-2 text-blue-800">{conference.title}</h2>
                                <p className="text-lg mb-2">{t("conference.platform")}: <span className="font-semibold text-blue-600">{conference.platform}</span></p>
                                <p className="text-lg">{t("conference.startTime")}: <span className="font-semibold text-blue-600">{new Date(conference.startTime).toLocaleString()}</span></p>
                            </div>
                            <div className="text-2xl font-semibold text-blue-800 border border-blue-800 px-8 py-4 rounded-lg shadow-sm">
                                {timeRemaining}
                            </div>
                        </div>
                        <div className="flex justify-center mt-8">
                            <a
                                href={conference.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-lg font-semibold text-blue-800 border border-blue-800 px-8 py-3 rounded-lg shadow-lg hover:bg-blue-100 transition duration-300 ease-in-out"
                            >
                                {t("conference.join")}
                            </a>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-lg text-blue-700">{t("conference.noConferences")}</p>
                )}
            </div>
        </div>
    );
};

export default ConferencePage;
