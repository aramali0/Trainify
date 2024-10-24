import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../helper/axios';
import { toast, ToastContainer } from 'react-toastify';
import Select from 'react-select';
import { getUser } from '../helper/auth';
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';

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

const AddSessionPage = ({ path }) => {
    const { t } = useTranslation('pages/addSessionPage'); // Hook for translation
    const navigate = useNavigate();
    const userId = getUser().userId;
    const [session, setSession] = useState({
        name: '',
        sessionDate: new Date().toISOString(),
        duree: '',
        startDate: '',
        endDate: '',
        courId: '',
        createdById: userId,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [errors, setErrors] = useState({
        name: '',
        duree: '',
        startDate: '',
        endDate: '',
        courId: '',
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axiosInstance.get(`/cours${path}/${userId}`);
                setCourses(response.data.map(c => ({ value: c.id, label: c.titre })));
            } catch (error) {
                toast.error(t("loadFailed"));
                console.error("Error fetching courses:", error);
            } finally {
                setLoadingCourses(false);
            }
        };

        fetchCourses();
    }, [userId, path, t]);

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
        const newErrors = { name: '', duree: '', startDate: '', endDate: '', courId: '' };

        // Name Validation
        if (!session.name.trim()) {
            newErrors.name = t('errors.nameRequired');
            isValid = false;
        } else if (!/^[a-zA-Z0-9-_.,+#\s]+$/.test(session.name)) {
            newErrors.name = t('errors.nameInvalid');
        }

        // Duration Validation
        if (!/^\d+$/.test(session.duree)) {
            newErrors.duree = t('errors.durationInvalid');
            isValid = false;
        }

        // Start Date Validation
        if (!session.startDate) {
            newErrors.startDate = t('errors.startDateRequired');
            isValid = false;
        }

        // End Date Validation
        if (!session.endDate) {
            newErrors.endDate = t('errors.endDateRequired');
            isValid = false;
        } else if (new Date(session.endDate) <= new Date(session.startDate)) {
            newErrors.endDate = t('errors.endDateInvalid');
            isValid = false;
        }

        // Course Selection Validation
        if (!session.courId) {
            newErrors.courId = t('errors.courseRequired');
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!validateForm()) return;

        try {
            const response = await axiosInstance.post('/sessions', session);
            toast.success(t("sessionAdded"));
            if (response?.data) {
                toast.success(response.data);
            }
            setSession({ name: '', sessionDate: '', duree: '', startDate: '', endDate: '', courId: '', createdById: userId });
            setErrors({ name: '', duree: '', startDate: '', endDate: '', courId: '' });
        } catch (error) {
            console.log(error);
            if (error.response.status === 400) {
                toast.error(error.response.data);
            } else {
                toast.error(t("sessionFailed"));
            }
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-6">{t("addSession")}</h1>
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
                        value={session.startDate}
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
                        value={session.endDate}
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
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`group relative w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                        isLoading
                            ? 'bg-indigo-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                    {isLoading ? (
                        <>
                            <ClipLoader size={20} color="#ffffff" className="mr-2" />
                            {t('loading')}
                        </>
                    ) : (
                        t('submit')
                    )}
                </button>
                </div>
            </form>
        </div>
    );
};

export default AddSessionPage;
