import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../helper/axios';
import { toast, ToastContainer } from 'react-toastify';
import Select from 'react-select';
import { getUser } from '../helper/auth';
import axiosInstanceForRessources from '../helper/axiosForResoures';
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

const UpdateCoursePage = ({ nom, path }) => {
    const { t, i18n } = useTranslation('pages/updateCourPage');
    const navigate = useNavigate();
    const { id } = useParams(); // Get course ID from route params
    const userId = getUser().userId;
    const [course, setCourse] = useState({
        titre: '',
        subTitre: '',
        description: '',
        duree: '',
        langue: 'ENGLISH',
        classIds: [],
        formateurIds: [],
        image: null,
    });

    const [classes, setClasses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [loadingClasses, setLoadingClasses] = useState(true);
    const [loadingInstructors, setLoadingInstructors] = useState(true);
    const [errors, setErrors] = useState({
        titre: '',
        subTitre: '',
        description: '',
        duree: '',
        image: ''
    });

    // Load course data for the given course ID
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await axiosInstanceForRessources.get(`/cours/${id}`);
                setCourse({
                    ...response.data,
                    classIds: response.data.classIds || [],
                    formateurIds: response.data.formateurIds || [],
                    image: null, // Do not pre-fill the image, keep it null unless a new one is uploaded
                });
            } catch (error) {
                toast.error(t("fail"));
            }
        };

        const getClasses = async () => {
            try {
                const response = await axiosInstance.get(nom === '/admin' ? `/classes` : `${path}/${userId}/classes`);
                setClasses(response.data.map(c => ({ value: c.id, label: c.titre })));
            } catch (error) {
                toast.error(t("fail"));
            } finally {
                setLoadingClasses(false);
            }
        };

        const fetchInstructors = async () => {
            try {
                const response = await axiosInstance.get(`/formateurs`);
                setInstructors(response.data.map(i => ({ value: i.id, label: i.firstName })));
            } catch (error) {
                toast.error(t("fail"));
            } finally {
                setLoadingInstructors(false);
            }
        };

        fetchCourseData();  // Load the course data when the component mounts
        getClasses();
        fetchInstructors();
    }, [id, userId, nom, path, t]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourse(prevState => ({ ...prevState, [name]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' })); // Clear error message on input change
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // Check if file size exceeds 2MB
                setErrors(prevErrors => ({ ...prevErrors, image: t("errors.image") }));
                return;
            }
            setCourse(prevState => ({ ...prevState, image: file }));
            setErrors(prevErrors => ({ ...prevErrors, image: '' })); // Clear error message on image change
        }
    };

    const handleSelectChange = (selectedOptions, actionMeta) => {
        const { name } = actionMeta;
        setCourse(prevState => ({
            ...prevState,
            [name]: selectedOptions.map(option => option.value)
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { titre: '', subTitre: '', description: '', duree: '', image: '' };

        // Title Validation
        if (!/^[a-zA-Z\s]+$/.test(course.titre)) {
            newErrors.titre = t("errors.title");
            isValid = false;
        }

        // Subtitle Validation
        if (!/^[a-zA-Z\s]+$/.test(course.subTitre)) {
            newErrors.subTitre = t("errors.subtitle");
            isValid = false;
        }

        // Description Validation
        if (!course.description.trim()) {
            newErrors.description = t("errors.description");
            isValid = false;
        }

        // Duration Validation
        if (!/^\d+$/.test(course.duree)) {
            newErrors.duree = t("errors.duration");
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData();
        Object.keys(course).forEach(key => {
            if (key === 'classIds' || key === 'formateurIds') {
                formData.append(key, JSON.stringify(course[key]));
            } else {
                formData.append(key, course[key]);
            }
        });

        try {
            await axiosInstanceForRessources.put(`/cours/${id}`, formData);
            toast.success(t("success"));
            navigate(`${nom}/courses`); 
        } catch (error) {
            toast.error(t("fail"));
        }
    };

    // Add RTL styles for Arabic
    const isArabic = course.langue === 'ARABE';

    return (
        <div className={`max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md `}
        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
            <form onSubmit={handleFormSubmit}>
                {/* Title */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="titre">{t("titleLabel")}</label>
                    <input
                        type="text"
                        name="titre"
                        value={course.titre}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.titre && <p className="text-red-500 text-sm mt-1">{errors.titre}</p>}
                </div>

                {/* Subtitle */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="subTitre">{t("subtitleLabel")}</label>
                    <input
                        type="text"
                        name="subTitre"
                        value={course.subTitre}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.subTitre && <p className="text-red-500 text-sm mt-1">{errors.subTitre}</p>}
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="description">{t("descriptionLabel")}</label>
                    <textarea
                        name="description"
                        value={course.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Duration */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="duree">{t("durationLabel")}</label>
                    <input
                        type="number"
                        name="duree"
                        value={course.duree}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.duree && <p className="text-red-500 text-sm mt-1">{errors.duree}</p>}
                </div>

                {/* Language */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="langue">{t("languageLabel")}</label>
                    <select
                        name="langue"
                        value={course.langue}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="ENGLISH">{t("languageOptions.english")}</option>
                        <option value="FRENSH">{t("languageOptions.french")}</option>
                        <option value="ARABE">{t("languageOptions.arabic")}</option>
                    </select>
                </div>

                {/* Class Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="classIds">{t("classLabel")}</label>
                    {loadingClasses ? (
                        <p>{t("loadingClasses")}</p>
                    ) : (
                        <Select
                            isMulti
                            name="classIds"
                            value={classes.filter(c => course.classIds.includes(c.value))}
                            onChange={handleSelectChange}
                            options={classes}
                            styles={customStyles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                    )}
                </div>

                {/* Instructor Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="formateurIds">{t("instructorLabel")}</label>
                    {loadingInstructors ? (
                        <p>{t("loadingInstructors")}</p>
                    ) : (
                        <Select
                            isMulti
                            name="formateurIds"
                            value={instructors.filter(i => course.formateurIds.includes(i.value))}
                            onChange={handleSelectChange}
                            options={instructors}
                            styles={customStyles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                    )}
                </div>

                {/* Image Upload */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="image">{t("imageLabel")}</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className="w-full p-2 border rounded"
                        accept="image/*"
                    />
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                    <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        {t("updateButton")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateCoursePage;
