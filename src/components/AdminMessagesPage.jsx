import React, { useState, useEffect } from 'react';
import axiosInstance from '../helper/axios';
import { useTranslation } from 'react-i18next';

const AdminMessagesPage = () => {
    const { t } = useTranslation('pages/adminMessagePage'); // Use the translation hook
    const [messages, setMessages] = useState([]);
    const [response, setResponse] = useState({});

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axiosInstance.get('/contact-messages');
                setMessages(response.data);
            } catch (error) {
                console.error(t('errorFetchingMessages'), error);
            }
        };

        fetchMessages();
    }, [t]);

    const handleResponseChange = (e, id) => {
        setResponse({ ...response, [id]: e.target.value });
    };

    const handleResponseSubmit = async (id) => {
        try {
            const responseText = response[id]?.trim() || '';
            await axiosInstance.put(`/contact-messages/${id}/response`, responseText);
            alert(t('responseSubmitted'));
        } catch (error) {
            console.error(t('errorSubmittingResponse'), error);
        }
    };

    return (
        <div className="container mx-auto p-6" dir={t('direction')}>
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">{t('submittedMessages')}</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {messages.map((msg) => (
                    <div key={msg.id} className="bg-white shadow-md rounded-xl overflow-hidden transition-transform transform hover:scale-105">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{msg.name}</h3>
                            <p className="text-gray-500 mb-4">{msg.email}</p>
                            <p className="text-gray-700 mb-4">{msg.message}</p>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={response[msg.id] || ''}
                                onChange={(e) => handleResponseChange(e, msg.id)}
                                placeholder={t('writeYourResponse')}
                                rows="4"
                            />
                            <button
                                className="mt-4 w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-transform transform hover:scale-105"
                                onClick={() => handleResponseSubmit(msg.id)}
                            >
                                {t('submitResponse')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminMessagesPage;
