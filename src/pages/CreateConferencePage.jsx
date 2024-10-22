import React, { useState } from 'react';
import axiosInstance from '../helper/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const CreateConferencePage = () => {
    const { sessionId } = useParams();
    const [title, setTitle] = useState('');
    const [platform, setPlatform] = useState('');
    const [url, setUrl] = useState('');
    const [startTime, setStartTime] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    // Error states for validation messages
    const [titleError, setTitleError] = useState('');
    const [platformError, setPlatformError] = useState('');
    const [urlError, setUrlError] = useState('');
    const [startTimeError, setStartTimeError] = useState('');
    const navigate = useNavigate();
    const { t, i18n } = useTranslation('pages/createConference'); // Use the translation hook


    const validateUrl = (url) => {
         const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
        return !!urlPattern.test(url);
    };

    const validateForm = () => {
        let isValid = true;

        // Reset errors
        setTitleError('');
        setPlatformError('');
        setUrlError('');
        setStartTimeError('');

        // Title validation
        if (!title.trim()) {
            setTitleError('Title cannot be empty');
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(title)) {
            setTitleError('Title must contain only letters and spaces.');
            isValid = false;
        }

        // Platform validation
        if (!platform.trim()) {
            setPlatformError('Platform cannot be empty');
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(platform)) {
            setPlatformError('Platform must contain only letters and spaces.');
            isValid = false;
        }

        // URL validation
        if (!validateUrl(url)) {
            setUrlError('Please enter a valid URL');
            isValid = false;
        }

        // Start time validation
        if (!startTime) {
            setStartTimeError('Start time cannot be empty');
            isValid = false;
        } else if (new Date(startTime) <= new Date()) {
            setStartTimeError('Start time must be in the future');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true); // Set loading state

        try {
            await axiosInstance.post(`/video-conferences`, {
                title,
                platform,
                url,
                startTime,
                sessionId: parseInt(sessionId) // Ensure sessionId is passed correctly
            });
            navigate(`/formateur/sessions`);
        } catch (error) {
            // Handle error (if needed)
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    // Function to determine if language is RTL (for Arabic)
    const isRtl = i18n.language === 'ar';

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
            <ToastContainer />
            <h2 className="text-2xl font-bold mb-4">{t('createConference')}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">{t('title')}</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`w-full p-2 border border-gray-300 rounded-md ${titleError ? 'border-red-500' : ''}`}
                    />
                    {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">{t('platform')}</label>
                    <input
                        type="text"
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className={`w-full p-2 border border-gray-300 rounded-md ${platformError ? 'border-red-500' : ''}`}
                    />
                    {platformError && <p className="text-red-500 text-sm mt-1">{platformError}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">{t('url')}</label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className={`w-full p-2 border border-gray-300 rounded-md ${urlError ? 'border-red-500' : ''}`}
                    />
                    {urlError && <p className="text-red-500 text-sm mt-1">{urlError}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">{t('startTime')}</label>
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className={`w-full p-2 border border-gray-300 rounded-md ${startTimeError ? 'border-red-500' : ''}`}
                    />
                    {startTimeError && <p className="text-red-500 text-sm mt-1">{startTimeError}</p>}
                </div>

                <button
                    type="submit"
                    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading} // Disable button while loading
                >
                    {loading ? t('creating') : t('createConference')}
                </button>
            </form>
        </div>
    );
};

export default CreateConferencePage;
