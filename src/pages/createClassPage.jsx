// src/components/CreateClassPage.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../helper/axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { getUser } from '../helper/auth';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const customStyles = {
    container: (provided) => ({
        ...provided,
        width: '100%',
    }),
    control: (provided) => ({
        ...provided,
        borderColor: '#e2e8f0',
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#cbd5e0',
        },
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#e2e8f0',
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#1a202c',
    }),
    menu: (provided) => ({
        ...provided,
        zIndex: 9999,
    }),
};

const CreateClassPage = ({ nom, path }) => {
    const { t, i18n } = useTranslation('pages/createCalssPage'); // Use translation hook
    const [titre, setTitre] = useState('');
    const [participants, setParticipants] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();
    const responsableId = getUser().userId;

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const response = await axiosInstance.get('/participants');
                setParticipants(response.data.map(p => ({ value: p.id, label: p.lastName })));
            } catch (error) {
                toast.error(t('messages.failedToFetchParticipants'));
            }
        };

        const fetchCourses = async () => {
            try {
                const response = await axiosInstance.get(`/cours${path}/${responsableId}`);
                setCourses(response.data.map(c => ({ value: c.id, label: c.titre })));
            } catch (error) {
                toast.error(t('messages.failedToFetchCourses'));
            }
        };

        fetchParticipants();
        fetchCourses();
    }, [responsableId, path, t]);

    const validateForm = () => {
        if (!titre.trim()) {
            toast.error(t('messages.classTitleEmpty'));
            return false;
        }
        if (!/^[a-zA-Z\s]+$/.test(titre)) {
            toast.error(t('messages.classTitleInvalid'));
            return false;
        }
        if (selectedParticipants.length === 0) {
            toast.error(t('messages.participantsRequired'));
            return false;
        }
        if (selectedCourses.length === 0) {
            toast.error(t('messages.coursesRequired'));
            return false;
        }
        return true;
    };

    const handleCreateClass = async () => {
        if (!validateForm()) return;

        setLoading(true); // Set loading state to true

        const classData = {
            titre,
            participantIds: selectedParticipants.map(p => p.value),
            courIds: selectedCourses.map(c => c.value),
        };

        try {
            const response = await axiosInstance.post('/classes', classData);
            toast.success(t('messages.classCreated'));
            if(response?.data) {
                toast.success(response.data);
            }
            setTitre('');
            setSelectedParticipants([]);
            setSelectedCourses([]);
        } catch (error) {
            toast.error(t('messages.classCreationFailed'));
            console.error('Error creating class:', error);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className={`p-6 bg-gray-100 ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-4 text-gray-800">{t('titles.createClass')}</h1>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">{t('labels.classTitle')}</label>
                    <input
                        type="text"
                        value={titre}
                        onChange={(e) => setTitre(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder={t('placeholders.classTitle')}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">{t('labels.selectParticipants')}</label>
                    <Select
                        isMulti
                        value={selectedParticipants}
                        onChange={setSelectedParticipants}
                        options={participants}
                        styles={customStyles}
                        placeholder={t('labels.selectParticipants')}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">{t('labels.selectCourses')}</label>
                    <Select
                        isMulti
                        value={selectedCourses}
                        onChange={setSelectedCourses}
                        options={courses}
                        styles={customStyles}
                        placeholder={t('labels.selectCourses')}
                    />
                </div>

                <button
                    onClick={handleCreateClass}
                    disabled={loading} // Disable button while loading
                    className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? t('buttons.creating') : t('buttons.createClass')}
                </button>
            </div>
        </div>
    );
};

export default CreateClassPage;

