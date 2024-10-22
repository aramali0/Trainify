import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../helper/axios';
import { toast, ToastContainer } from 'react-toastify';
import Select from 'react-select';
import { getUser } from '../helper/auth';
import { useTranslation } from 'react-i18next';

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

const EditSectionPage = ({ path, nom }) => {
    const { t } = useTranslation('pages/editSection');
    const { id } = useParams();
    const navigate = useNavigate();
    const userId = getUser().userId;
    const [section, setSection] = useState({
        title: '',
        content: '',
        startDate: '',
        endDate: '',
        sessionId: '',
        createdById: userId,
        questionIds: [],
        resourceIds: []
    });

    const [sessions, setSessions] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [errors, setErrors] = useState({
        title: '',
        content: '',
        startDate: '',
        endDate: '',
        sessionId: '',
    });

    useEffect(() => {
        const fetchSection = async () => {
            try {
                const response = await axiosInstance.get(`/sections/${id}`);
                setSection(response.data);
            } catch (error) {
                toast.error(t("updateFailure")); // Use translated message
            }
        };

        const fetchSessions = async () => {
            try {
                const response = await axiosInstance.get(`${path}/${userId}/sessions`);
                setSessions(response.data.map(s => ({ value: s.id, label: s.name })));
            } catch (error) {
                toast.error(t("loadingSessions")); // Use translated message
            } finally {
                setLoadingSessions(false);
            }
        };

        fetchSection();
        fetchSessions();
    }, [id, userId, path, t]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSection(prevState => ({ ...prevState, [name]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' })); // Clear error message on input change
    };

    const handleSelectChange = (selectedOptions, actionMeta) => {
        const { name } = actionMeta;

        if (name === 'sessionId') {
            // For single select
            setSection(prevState => ({
                ...prevState,
                [name]: selectedOptions ? selectedOptions.value : ''
            }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { title: '', content: '', startDate: '', endDate: '', sessionId: '' };

        // Title Validation
        if (!section.title.trim()) {
            newErrors.title = t("errors.titleRequired");
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(section.title)) {
            newErrors.title = t("errors.titleInvalid");
            isValid = false;
        }

        // Content Validation
        if (!section.content.trim()) {
            newErrors.content = t("errors.contentRequired");
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(section.content)) {
            newErrors.content = t("errors.contentInvalid");
            isValid = false;
        }

        // Start Date Validation
        if (!section.startDate) {
            newErrors.startDate = t("errors.startDateRequired");
            isValid = false;
        }

        // End Date Validation
        if (!section.endDate) {
            newErrors.endDate = t("errors.endDateRequired");
            isValid = false;
        } else if (new Date(section.endDate) <= new Date(section.startDate)) {
            newErrors.endDate = t("errors.endDateInvalid");
            isValid = false;
        }

        // Session Selection Validation
        if (!section.sessionId) {
            newErrors.sessionId = t("errors.sessionRequired");
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await axiosInstance.put(`/sections/${id}`, section);
            toast.success(t("updateSuccess")); // Use translated message
            navigate(`${nom}/sections`);
        } catch (error) {
            toast.error(t("updateFailure")); // Use translated message
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-6">{t("editSection")}</h1>
            <form onSubmit={handleFormSubmit}>
                {/* Title */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="title">{t("title")}</label>
                    <input
                        type="text"
                        name="title"
                        value={section.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Content */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="content">{t("content")}</label>
                    <textarea
                        name="content"
                        value={section.content}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                </div>

                {/* Start Date */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="startDate">{t("startDate")}</label>
                    <input
                        type="date"
                        name="startDate"
                        value={section.startDate.toString().split('T')[0]}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                </div>

                {/* End Date */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="endDate">{t("endDate")}</label>
                    <input
                        type="date"
                        name="endDate"
                        value={section.endDate.toString().split('T')[0]}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </div>

                {/* Session Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="sessionId">{t("session")}</label>
                    {loadingSessions ? (
                        <p>{t("loadingSessions")}</p>
                    ) : (
                        <Select
                            name="sessionId"
                            value={sessions.find(s => s.value === section.sessionId)}
                            onChange={handleSelectChange}
                            options={sessions}
                            styles={customStyles}
                            className="basic-single"
                            classNamePrefix="select"
                        />
                    )}
                    {errors.sessionId && <p className="text-red-500 text-sm mt-1">{errors.sessionId}</p>}
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                    <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t("updateSection")}</button>
                </div>
            </form>
        </div>
    );
};

export default EditSectionPage;
