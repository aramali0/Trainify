import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { getUser } from '../helper/auth';
import { useTranslation } from 'react-i18next'; // i18n hook
import axiosInstance from '../helper/axios';

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

const EditClassPage = ({ nom, path }) => {
    const { t, i18n } = useTranslation('pages/editClass'); // Translation hook
    const { id } = useParams();
    const [titre, setTitre] = useState('');
    const [participants, setParticipants] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const responsableId = getUser().userId;

    const isRTL = i18n.language === 'ar';

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const response = await axiosInstance.get(`/classes/${id}`);
                const classData = response.data;
                setTitre(classData.titre);
                setSelectedParticipants(classData.participantIds);
                setSelectedCourses(classData.courIds);
            } catch (error) {
                toast.error(t('messages.failedToFetchClassData'));
            }
        };

        const fetchParticipants = async () => {
            try {
                const response = await axiosInstance.get('/participants');
                setParticipants(response.data.map(p => ({ value: p.id, label: p.firstName })));
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

        fetchClassData();
        fetchParticipants();
        fetchCourses();
    }, [id, path, responsableId, t]);

    const handleInputChange = (e) => {
        setTitre(e.target.value);
    };

    const handleSelectChange = (selectedOptions, actionMeta) => {
        const { name } = actionMeta;
        if (name === 'participantIds') {
            setSelectedParticipants(selectedOptions ? selectedOptions.map(option => option.value) : []);
        } else if (name === 'courseIds') {
            setSelectedCourses(selectedOptions ? selectedOptions.map(option => option.value) : []);
        }
    };

    const validateForm = () => {
        if (!titre.trim()) {
            toast.error(t('messages.classTitleEmpty'));
            return false;
        } else if (!/^[a-zA-Z\s]+$/.test(titre)) {
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

    const handleUpdateClass = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        const classData = {
            titre,
            participantIds: selectedParticipants,
            courIds: selectedCourses,
        };

        try {
            await axiosInstance.put(`/classes/${id}`, classData);
            toast.success(t('messages.classUpdated'));
            navigate(`${nom}/classes`);
        } catch (error) {
            toast.error(t('messages.classUpdateFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md ${ isRTL ? 'rtl' : ''}`}>
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-6">{t('titles.editClass')}</h1>
            <form onSubmit={handleUpdateClass}>
                {/* Class Title */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="titre">{t('labels.classTitle')}</label>
                    <input
                        type="text"
                        name="titre"
                        value={titre}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder={t('placeholders.classTitle')}
                        required
                    />
                </div>

                {/* Participants Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="participantIds">{t('labels.participants')}</label>
                    <Select
                        isMulti
                        name="participantIds"
                        value={participants.filter(p => selectedParticipants.includes(p.value))}
                        onChange={handleSelectChange}
                        options={participants}
                        styles={customStyles}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                </div>

                {/* Courses Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="courseIds">{t('labels.courses')}</label>
                    <Select
                        isMulti
                        name="courseIds"
                        value={courses.filter(c => selectedCourses.includes(c.value))}
                        onChange={handleSelectChange}
                        options={courses}
                        styles={customStyles}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                </div>

                {/* Update Button */}
                <div className="mt-6">
                    <button
                        type="submit"
                        className={`w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? t('buttons.updating') : t('buttons.updateClass')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditClassPage;
