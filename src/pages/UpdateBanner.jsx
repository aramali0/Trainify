import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../helper/axios';

const UpdateBanner = () => {
    const { id } = useParams();
    const [banner, setBanner] = useState({
        title: '',
        subtitle: '',
        link1Href: '',
        link1Text: '',
        link2Href: '',
        link2Text: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { t } = useTranslation('pages/updateBanner'); // Specify the namespace

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const response = await axiosInstance.get(`/banners/${id}`);
                setBanner(response.data);

                if (response.data.backgroundImage) {
                    const imageResponse = await axiosInstance.get(`/${response.data.backgroundImage}`, {
                        responseType: 'blob'
                    });
                    const imageUrl = URL.createObjectURL(imageResponse.data);
                    setPreviewImage(imageUrl);
                } else {
                    setPreviewImage("https://via.placeholder.com/150");
                }
            } catch (error) {
                console.error('Error fetching banner:', error);
                toast.error(t('errors.failedToLoadBanner'));
            }
        };

        fetchBanner();
    }, [id, t]);

    const handleChange = (e) => {
        setBanner({
            ...banner,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);

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

        // Validate title and subtitle
        const textRegex = /^[a-zA-Z0-9,.!? ]+$/;
        if (banner.title && !banner.title.match(textRegex)) {
            newErrors.title = t('errors.invalidTitle');
        }
        if (banner.subtitle && !banner.subtitle.match(textRegex)) {
            newErrors.subtitle = t('errors.invalidSubtitle');
        }

        // Validate URLs
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        if (banner.link1Href && !banner.link1Href.match(urlRegex)) {
            newErrors.link1Href = t('errors.invalidLinkHref', { linkNumber: 1 });
        }
        if (banner.link2Href && !banner.link2Href.match(urlRegex)) {
            newErrors.link2Href = t('errors.invalidLinkHref', { linkNumber: 2 });
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form before submission
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const formData = new FormData();
        formData.append('title', banner.title);
        formData.append('subtitle', banner.subtitle);
        formData.append('link1Href', banner.link1Href);
        formData.append('link1Text', banner.link1Text);
        formData.append('link2Href', banner.link2Href);
        formData.append('link2Text', banner.link2Text);
        if (imageFile) {
            formData.append('backgroundImage', imageFile);
        }

        try {
            await axiosInstance.put(`/banners/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success(t('messages.bannerUpdatedSuccessfully'));
            navigate('/admin/banners');
        } catch (error) {
            console.error('Error updating banner:', error);
            if (error.response?.data) {
                toast.error(error.response.data);
            } else {
                toast.error(t('errors.failedToUpdateBanner'));
            }
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg sm:max-w-full md:max-w-xl lg:max-w-2xl">
            <ToastContainer />
            <h1 className="text-2xl font-semibold mb-6 text-center">{t('titles.updateBanner')}</h1>
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                <div className="text-center mb-6">
                    {previewImage ? (
                        <img src={previewImage} alt={t('labels.previewImage')} className="w-24 h-24 object-cover rounded-lg mx-auto mb-4" />
                    ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                    )}
                    <input 
                        type="file" 
                        name="backgroundImage" 
                        onChange={handleImageChange} 
                        className="w-full mb-4" 
                        aria-label={t('labels.backgroundImage')}
                    />
                    {errors.imageFile && <p className="text-red-500 text-sm mt-1">{errors.imageFile}</p>}
                </div>
                <div>
                    <label className="block text-gray-700">{t('labels.title')}</label>
                    <input
                        type="text"
                        name="title"
                        value={banner.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                        aria-label={t('labels.title')}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                <div>
                    <label className="block text-gray-700">{t('labels.subtitle')}</label>
                    <input
                        type="text"
                        name="subtitle"
                        value={banner.subtitle}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                        aria-label={t('labels.subtitle')}
                    />
                    {errors.subtitle && <p className="text-red-500 text-sm mt-1">{errors.subtitle}</p>}
                </div>
                <div className="md:flex gap-4">
                    <div className="flex-1">
                        <label className="block text-gray-700">{t('labels.link1Href')}</label>
                        <input
                            type="text"
                            name="link1Href"
                            value={banner.link1Href}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            aria-label={t('labels.link1Href')}
                        />
                        {errors.link1Href && <p className="text-red-500 text-sm mt-1">{errors.link1Href}</p>}
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-700">{t('labels.link1Text')}</label>
                        <input
                            type="text"
                            name="link1Text"
                            value={banner.link1Text}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            aria-label={t('labels.link1Text')}
                        />
                        {errors.link1Text && <p className="text-red-500 text-sm mt-1">{errors.link1Text}</p>}
                    </div>
                </div>
                <div className="md:flex gap-4">
                    <div className="flex-1">
                        <label className="block text-gray-700">{t('labels.link2Href')}</label>
                        <input
                            type="text"
                            name="link2Href"
                            value={banner.link2Href}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            aria-label={t('labels.link2Href')}
                        />
                        {errors.link2Href && <p className="text-red-500 text-sm mt-1">{errors.link2Href}</p>}
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-700">{t('labels.link2Text')}</label>
                        <input
                            type="text"
                            name="link2Text"
                            value={banner.link2Text}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            aria-label={t('labels.link2Text')}
                        />
                        {errors.link2Text && <p className="text-red-500 text-sm mt-1">{errors.link2Text}</p>}
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    {t('buttons.updateBanner')}
                </button>
            </form>
        </div>
    );
};
    export default UpdateBanner;