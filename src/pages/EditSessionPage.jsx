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

const EditSessionPage = ({ nom, path }) => {
    const { t } = useTranslation('pages/editSession');
    const { id } = useParams();
    const navigate = useNavigate();
    const userId = getUser().userId;
    const [session, setSession] = useState({
        name: '',
        sessionDate: '',
        duree: '',
        startDate: '',
        endDate: '',
        courId: '',
        createdById: userId,
    });

    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [errors, setErrors] = useState({
        name: '',
        sessionDate: '',
        duree: '',
        startDate: '',
        endDate: '',
        courId: '',
    });

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await axiosInstance.get(`/sessions/${id}`);
                setSession(response.data);
            } catch (error) {
                toast.error(t("errors.loadSessionFailed"));
            }
        };

        const fetchCourses = async () => {
            try {
                const response = await axiosInstance.get(`/cours${path}/${userId}`);
                setCourses(response.data.map(c => ({ value: c.id, label: c.titre })));
            } catch (error) {
                toast.error(t("errors.loadCoursesFailed"));
                console.error("Error fetching courses:", error);
            } finally {
                setLoadingCourses(false);
            }
        };

        fetchSession();
        fetchCourses();
    }, [id, userId, path, t]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSession(prevState => ({ ...prevState, [name]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' })); // Clear error message on input change
    };

    const handleSelectChange = (selectedOptions, actionMeta) => {
        const { name } = actionMeta;

        if (name === 'courId') {
            setSession(prevState => ({
                ...prevState,
                [name]: selectedOptions ? selectedOptions.value : ''
            }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { name: '', sessionDate: '', duree: '', startDate: '', endDate: '', courId: '' };

        // Name Validation
        if (!session.name.trim()) {
            newErrors.name = t("errors.nameRequired");
            isValid = false;
        } else if (!/^[a-zA-Z0-9\s]+$/.test(session.name)) {
            newErrors.name = t("errors.nameInvalid");
            isValid = false;
        }

        // Session Date Validation
        if (!session.sessionDate) {
            newErrors.sessionDate = t("errors.sessionDateRequired");
            isValid = false;
        }

        // Duration Validation
        if (!/^\d+$/.test(session.duree)) {
            newErrors.duree = t("errors.durationInvalid");
            isValid = false;
        }

        // Start Date Validation
        if (!session.startDate) {
            newErrors.startDate = t("errors.startDateRequired");
            isValid = false;
        }

        // End Date Validation
        if (!session.endDate) {
            newErrors.endDate = t("errors.endDateRequired");
            isValid = false;
        } else if (new Date(session.endDate) <= new Date(session.startDate)) {
            newErrors.endDate = t("errors.endDateInvalid");
            isValid = false;
        }

        // Course Selection Validation
        if (!session.courId) {
            newErrors.courId = t("errors.courseRequired");
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await axiosInstance.put(`/sessions/${id}`, session);
            toast.success(t("sessionUpdated"));
            navigate(`${nom}/sessions`);
        } catch (error) {
            toast.error(t("errors.updateSessionFailed"));
        }
    };

    return (
        <div className={`max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md ${session.courId ? '' : 'rtl'}`}>
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-6">{t("editSession")}</h1>
            <form onSubmit={handleFormSubmit}>
                {/* Name */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="name">{t("name")}</label>
                    <input
                        type="text"
                        name="name"
                        value={session.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Session Date */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="sessionDate">{t("sessionDate")}</label>
                    <input
                        type="date"
                        name="sessionDate"
                        value={session.sessionDate.split('T')[0]}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.sessionDate && <p className="text-red-500 text-sm mt-1">{errors.sessionDate}</p>}
                </div>

                {/* Duration */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="duree">{t("duration")}</label>
                    <input
                        type="number"
                        name="duree"
                        value={session.duree}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.duree && <p className="text-red-500 text-sm mt-1">{errors.duree}</p>}
                </div>

                {/* Start Date */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="startDate">{t("startDate")}</label>
                    <input
                        type="date"
                        name="startDate"
                        value={session.startDate.split('T')[0]}
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
                        value={session.endDate.split('T')[0]}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </div>

                {/* Course Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="courId">{t("course")}</label>
                    {loadingCourses ? (
                        <p>{t("loading")}</p>
                    ) : (
                        <Select
                            name="courId"
                            value={courses.find(c => c.value === session.courId)}
                            onChange={handleSelectChange}
                            options={courses}
                            styles={customStyles}
                            className="basic-single"
                            classNamePrefix="select"
                        />
                    )}
                    {errors.courId && <p className="text-red-500 text-sm mt-1">{errors.courId}</p>}
                </div>
                {/* Submit Button */}
                <div className="mt-6">
                    <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t("updateSession")}</button>
                </div>
            </form>
        </div>
    );
};

export default EditSessionPage;
