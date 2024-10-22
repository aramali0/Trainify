import React, { useState } from 'react';
import axiosInstance from '../helper/axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import supportedLanguages from '../helper/util';
const CreateBanner = () => {
    const [banner, setBanner] = useState({
        link1Href: '',
        link2Href: '',
    });
    const [translations, setTranslations] = useState(
        supportedLanguages.map(lang => ({
            language: lang.code,
            title: '',
            subtitle: '',
            link1Text: '',
            link2Text: '',
        }))
    );
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { t } = useTranslation('pages/createBanner'); // Specify the namespace

    const handleBannerChange = (e) => {
        setBanner({
            ...banner,
            [e.target.name]: e.target.value,
        });
    };

    const handleTranslationChange = (index, field, value) => {
        const newTranslations = [...translations];
        newTranslations[index][field] = value;
        setTranslations(newTranslations);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        // File size validation (2MB limit)
        if (file && file.size > 2 * 1024 * 1024) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                imageFile: t('errors.imageTooLarge'),
            }));
            return;
        }

        setImageFile(file);
        setErrors((prevErrors) => ({ ...prevErrors, imageFile: null })); // Clear image error if valid

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate translations
        translations.forEach((translation, index) => {
            const lang = supportedLanguages[index].label;
            if (!translation.title.trim()) {
                newErrors[`title_${translation.language}`] = `${lang}: ${t('errors.invalidTitle')}`;
            }
            if (!translation.subtitle.trim()) {
                newErrors[`subtitle_${translation.language}`] = `${lang}: ${t('errors.invalidSubtitle')}`;
            }
            // Optionally, validate link texts if required
            // if (!translation.link1Text.trim()) {
            //     newErrors[`link1Text_${translation.language}`] = `${lang}: ${t('errors.invalidLink1Text')}`;
            // }
            // if (!translation.link2Text.trim()) {
            //     newErrors[`link2Text_${translation.language}`] = `${lang}: ${t('errors.invalidLink2Text')}`;
            // }
        });

        // Links should be valid URLs if provided
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        if (banner.link1Href && !urlRegex.test(banner.link1Href)) {
            newErrors.link1Href = t('errors.invalidLink1Href');
        }
        if (banner.link2Href && !urlRegex.test(banner.link2Href)) {
            newErrors.link2Href = t('errors.invalidLink2Href');
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form before submitting
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const formData = new FormData();
        formData.append('link1Href', banner.link1Href);
        formData.append('link2Href', banner.link2Href);
        if (imageFile) {
            formData.append('backgroundImage', imageFile);
        }
        // Append translations as JSON string
        formData.append('translations', JSON.stringify(translations));

        try {
            await axiosInstance.post('/banners/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success(t('messages.bannerCreatedSuccessfully'));
            navigate('/admin/banners'); // Redirect to banner list or another appropriate page
        } catch (error) {
            console.error('Error creating banner:', error);
            if (error.response?.data) {
                toast.error(error.response.data);
            } else {
                toast.error(t('errors.failedToCreateBanner'));
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
            <ToastContainer />
            <h1 className="text-3xl font-semibold mb-6 text-center">{t('titles.createBanner')}</h1>
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                <div className="text-center mb-6">
                    {previewImage ? (
                        <img src={previewImage} alt={t('labels.previewImage')} className="w-32 h-32 object-cover rounded-lg mx-auto mb-4" />
                    ) : (
                        <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <span className="text-gray-500">{t('labels.noImage')}</span>
                        </div>
                    )}
                    <input 
                        type="file" 
                        name="backgroundImage" 
                        onChange={handleImageChange} 
                        className="w-full mb-4" 
                        required 
                        aria-label={t('aria.uploadImage')}
                        accept="image/*"
                    />
                    {errors.imageFile && <p className="text-red-500 text-sm mt-1">{errors.imageFile}</p>}
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">{t('titles.translations')}</h2>
                    {supportedLanguages.map((lang, index) => (
                        <div key={lang.code} className="mb-6 border p-4 rounded-lg">
                            <h3 className="text-lg font-medium mb-2">{lang.label}</h3>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">{t('labels.title')}</label>
                                <input
                                    type="text"
                                    name={`title_${lang.code}`}
                                    value={translations[index].title}
                                    onChange={(e) => handleTranslationChange(index, 'title', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors[`title_${lang.code}`] ? 'border-red-500' : ''}`}
                                    required
                                    aria-label={t('aria.title', { lang: lang.label })}
                                />
                                {errors[`title_${lang.code}`] && <p className="text-red-500 text-sm mt-1">{errors[`title_${lang.code}`]}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">{t('labels.subtitle')}</label>
                                <input
                                    type="text"
                                    name={`subtitle_${lang.code}`}
                                    value={translations[index].subtitle}
                                    onChange={(e) => handleTranslationChange(index, 'subtitle', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors[`subtitle_${lang.code}`] ? 'border-red-500' : ''}`}
                                    required
                                    aria-label={t('aria.subtitle', { lang: lang.label })}
                                />
                                {errors[`subtitle_${lang.code}`] && <p className="text-red-500 text-sm mt-1">{errors[`subtitle_${lang.code}`]}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">{t('labels.link1Text')}</label>
                                <input
                                    type="text"
                                    name={`link1Text_${lang.code}`}
                                    value={translations[index].link1Text}
                                    onChange={(e) => handleTranslationChange(index, 'link1Text', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors[`link1Text_${lang.code}`] ? 'border-red-500' : ''}`}
                                    aria-label={t('aria.link1Text', { lang: lang.label })}
                                />
                                {errors[`link1Text_${lang.code}`] && <p className="text-red-500 text-sm mt-1">{errors[`link1Text_${lang.code}`]}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">{t('labels.link2Text')}</label>
                                <input
                                    type="text"
                                    name={`link2Text_${lang.code}`}
                                    value={translations[index].link2Text}
                                    onChange={(e) => handleTranslationChange(index, 'link2Text', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors[`link2Text_${lang.code}`] ? 'border-red-500' : ''}`}
                                    aria-label={t('aria.link2Text', { lang: lang.label })}
                                />
                                {errors[`link2Text_${lang.code}`] && <p className="text-red-500 text-sm mt-1">{errors[`link2Text_${lang.code}`]}</p>}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Links Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">{t('titles.links')}</h2>
                    <div className="md:flex gap-4">
                        <div className="flex-1 mb-4 md:mb-0">
                            <label className="block text-gray-700 mb-1">{t('labels.link1Href')}</label>
                            <input
                                type="url"
                                name="link1Href"
                                value={banner.link1Href}
                                onChange={handleBannerChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.link1Href ? 'border-red-500' : ''}`}
                                aria-label={t('aria.link1Href')}
                            />
                            {errors.link1Href && <p className="text-red-500 text-sm mt-1">{errors.link1Href}</p>}
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-700 mb-1">{t('labels.link2Href')}</label>
                            <input
                                type="url"
                                name="link2Href"
                                value={banner.link2Href}
                                onChange={handleBannerChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.link2Href ? 'border-red-500' : ''}`}
                                aria-label={t('aria.link2Href')}
                            />
                            {errors.link2Href && <p className="text-red-500 text-sm mt-1">{errors.link2Href}</p>}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    {t('buttons.createBanner')}
                </button>
            </form>
        </div>
    );
};
    export default CreateBanner;
