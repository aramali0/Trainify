import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../helper/axios';
import { toast, ToastContainer } from 'react-toastify';
import Select from 'react-select';
import { getUser } from '../helper/auth';
import axiosInstanceForRessources from '../helper/axiosForResoures';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

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

const AddCoursePage = ({ nom, path }) => {
    const { t,i18n } = useTranslation('pages/addCoursePage');
    const navigate = useNavigate();
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
        createdAt: new Date().toISOString(),
        isAproved: false,
    });

    const [isLoading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [loadingClasses, setLoadingClasses] = useState(true);
    const [loadingInstructors, setLoadingInstructors] = useState(true);
    const [errors, setErrors] = useState({
        titre: '',
        subTitre: '',
        description: '',
        duree: '',
        image: '',
    });

    useEffect(() => {
        const getClasses = async () => {
            try {
                const response = await axiosInstance.get(nom === "admin" ? `classes` : `${path}/${userId}/classes`);
                setClasses(response.data.map(c => ({ value: c.id, label: c.titre })));
            } catch (error) {
                toast.error(t("errors.loadClasses"));
            } finally {
                setLoadingClasses(false);
            }
        };

        const fetchInstructors = async () => {
            try {
                const response = await axiosInstance.get(nom === "admin" ? `formateurs` : `${path}/${userId}/formateurs`);
                setInstructors(response.data.map(i => ({ value: i.id, label: i.firstName })));
            } catch (error) {
                toast.error(t("errors.loadInstructors"));
            } finally {
                setLoadingInstructors(false);
            }
        };

        getClasses();
        fetchInstructors();
    }, [userId, nom, path, t]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourse(prevState => ({ ...prevState, [name]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' })); // Clear error message on input change
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // Check if file size exceeds 2MB
                setErrors(prevErrors => ({ ...prevErrors, image: t("errors.imageSize") }));
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
        if (!/^[a-zA-Z0-9-_.,+#\s]+$/.test(course.titre)) {
            newErrors.titre = t("errors.title");
            isValid = false;
        }

        // Subtitle Validation
        if (!/^[a-zA-Z0-9-_.,+#\s]+$/.test(course.subTitre)) {
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

        // Image Validation
        if (!course.image) {
            newErrors.image = t("errors.imageRequired");
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
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
            const response = await axiosInstanceForRessources.post('/cours', formData);
            toast.success(t("success"));
            setCourse({
                titre: '',
                subTitre: '',
                description: '',
                duree: '',
                langue: 'ENGLISH',
                classIds: [],
                formateurIds: [],
                image: null,
                createdAt: new Date().toISOString(),
                isAproved: false,
            });
            setErrors({ titre: '', subTitre: '', description: '', duree: '', image: '' });
        } catch (error) {
            toast.error(t("errors.addCourse"));
        }
        finally {
            setLoading(false);
        }
    };

    // Add RTL styles for Arabic
    const isArabic = i18n.language === 'ar';

    return (
        <div className={`max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md ${isArabic ? 'text-right' : 'text-left'}`}
        dir= {isArabic ? 'rtl' : 'ltr'}
        >
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
                        <option value="ENGLISH">English</option>
                        <option value="FRENSH">French</option>
                        <option value="ARABE">Arabic</option>
                    </select>
                </div>

                {/* Class Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="classIds">{t("classesLabel")}</label>
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
                    <label className="block text-sm font-bold mb-2" htmlFor="formateurIds">{t("instructorsLabel")}</label>
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

export default AddCoursePage;
