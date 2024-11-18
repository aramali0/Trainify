import React, { useEffect, useState } from 'react';
import axiosInstance from '../helper/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

const AdminAboutUsPage = () => {
    const [aboutUsData, setAboutUsData] = useState({
        title_en: '',
        title_fr: '',
        title_ar: '',
        description_en: '',
        description_fr: '',
        description_ar: '',
        imagePath: ''
    });
    const [image, setImage] = useState(null);
    const [imageError, setImageError] = useState('');
    const [errors, setErrors] = useState({});
    const { t } = useTranslation('pages/adminAboutUsPage');

    useEffect(() => {
        const fetchAboutUsData = async () => {
            try {
                const response = await axiosInstance.get('/about-us');
                setAboutUsData(response.data);
            } catch (error) {
                console.error('Error fetching about us data', error);
                toast.error(t('errors.failedToLoadAboutUs'));
            }
        };
        fetchAboutUsData();
    }, [t]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAboutUsData({ ...aboutUsData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setImageError(t('errors.invalidImageType'));
                setImage(null);
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                setImageError(t('errors.imageSizeLimit'));
                setImage(null);
                return;
            }

            setImageError('');
            setImage(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Add validation for each title and description field
        // Object.keys(aboutUsData).forEach((key) => {
        //     if (key.startsWith('title') && !/^[a-zA-Z\s\u0600-\u06FF&/?|'"]+$/.test(aboutUsData[key])) {
        //         newErrors[key] = t('errors.invalidTitle');
        //     }
        //     if (key.startsWith('description') && aboutUsData[key]?.length < 10) {
        //         newErrors[key] = t('errors.descriptionTooShort');
        //     }

        // });

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            Object.values(formErrors).forEach(errorMsg => toast.error(errorMsg));
            return;
        }

        const formData = new FormData();
        formData.append('aboutUsSection', new Blob([JSON.stringify(aboutUsData)], { type: 'application/json' }));
        if (image) {
            formData.append('image', image);
        }

        try {
            await axiosInstance.put('/about-us', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success(t('messages.aboutUsUpdatedSuccessfully'));
        } catch (error) {
            console.error('Error updating about us data', error);
            toast.error(t('errors.failedToUpdateAboutUs'));
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 md:max-w-4xl">
            <ToastContainer />
            <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-6">{t('titles.updateAboutUs')}</h2>
                <form onSubmit={handleSubmit}>
                    {['en', 'fr', 'ar'].map(lang => (
                        <div key={lang} className="mb-4 sm:mb-6">
                            <label htmlFor={`title_${lang}`} className="block text-md sm:text-lg font-medium text-gray-700 mb-2">{t(`labels.title_${lang}`)}</label>
                            <input
                                type="text"
                                id={`title_${lang}`}
                                name={`title_${lang}`}
                                value={aboutUsData[`title_${lang}`]}
                                onChange={handleInputChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                                aria-label={t(`aria.title_${lang}`)}
                            />
                        </div>
                    ))}
                    {['en', 'fr', 'ar'].map(lang => (
                        <div key={lang} className="mb-4 sm:mb-6">
                            <label htmlFor={`description_${lang}`} className="block text-md sm:text-lg font-medium text-gray-700 mb-2">{t(`labels.description_${lang}`)}</label>
                            <textarea
                                id={`description_${lang}`}
                                name={`description_${lang}`}
                                value={aboutUsData[`description_${lang}`]}
                                onChange={handleInputChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows="5"
                                required
                                aria-label={t(`aria.description_${lang}`)}
                            />
                        </div>
                    ))}
                    <div className="mb-4 sm:mb-6">
                        <label htmlFor="image" className="block text-md sm:text-lg font-medium text-gray-700 mb-2">{t('labels.uploadImage')}</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            onChange={handleImageChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label={t('aria.uploadImage')}
                        />
                        {imageError && <p className="text-red-500 text-sm mt-2">{imageError}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {t('buttons.saveChanges')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminAboutUsPage;
