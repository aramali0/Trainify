import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstanceForRessources from '../helper/axiosForResoures';
import { useTranslation } from 'react-i18next';

const CreateEventPage = () => {
    const { t } = useTranslation('pages/createEventPage');
    const [event, setEvent] = useState({
        title_en: '',
        description_en: '',
        title_fr: '',
        description_fr: '',
        title_ar: '',
        description_ar: '',
        date: '',
        location: '',
        image: null,
    });
    const [errors, setErrors] = useState({});

    const validate = (field, value) => {
        const newErrors = { ...errors };

        // const regex = /^[a-zA-Z0-9\u0600-\u06FFÀ-ÿ!?/\,.\s]+$/;
        // if (['title_en', 'description_en', 'title_fr', 'description_fr', 'title_ar', 'description_ar', 'location'].includes(field)) {
        //     if (!value.match(regex)) {
        //         newErrors[field] = t(`${field}Validation`);
        //     } else {
        //         delete newErrors[field];
        //     }
    // } 
          if (field === 'date') {
            const today = new Date().toISOString().split('T')[0];
            if (value < today) {
                newErrors.date = t('datePast');
            } else {
                delete newErrors.date;
            }
        } else if (field === 'image') {
            if (value) {
                const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
                if (!allowedTypes.includes(value.type)) {
                    newErrors.image = t('imageValidation');
                } else if (value.size > 2 * 1024 * 1024) { // 2MB limit
                    newErrors.image = t('imageSizeLimit');
                } else {
                    delete newErrors.image;
                }
            }
        }

        setErrors(newErrors);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEvent(prevState => {
            const updatedEvent = { ...prevState, [name]: value };
            validate(name, value);
            return updatedEvent;
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setEvent(prevState => {
            const updatedEvent = { ...prevState, image: file };
            validate('image', file);
            return updatedEvent;
        });
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate title, description, and location
        const textRegex = /^[a-zA-Z0-9,.!? ]+$/;
        if (!event.title.match(/^[a-zA-Z]+$/)) {
            newErrors.title = 'Title can only contain letters';
        }
        if (!event.description.match(textRegex)) {
            newErrors.description = 'Description can only contain letters, numbers, spaces, and . , ! ?';
        }
        if (!event.location.match(textRegex)) {
            newErrors.location = 'Location can only contain letters, numbers, spaces, and . , ! ?';
        }

        // Validate date
        const today = new Date().toISOString().split('T')[0];
        if (event.date < today) {
            newErrors.date = 'Date cannot be in the past.';
        }

        // Validate image file
        if (event.image) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(event.image.type)) {
                newErrors.image = 'Only JPEG, PNG, and GIF images are allowed.';
            }
            if (event.image.size > 5 * 1024 * 1024) { // 5MB limit
                newErrors.image = 'Image file size should be less than 5MB.';
            }
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields before submission
        const formErrors = {};
        Object.keys(event).forEach(field => {
            validate(field, event[field]);
        });

        if (Object.keys(errors).length > 0) {
            toast.error(t("formError"));
            return;
        }

        const formData = new FormData();
        Object.keys(event).forEach(key => {
            formData.append(key, event[key]);
        });

        try {
            await axiosInstanceForRessources.post('/events', formData);
            toast.success(t("eventCreated"));
            setEvent({ title_en: '', description_en: '', title_fr: '', description_fr: '', title_ar: '', description_ar: '', date: '', location: '', image: null });
            setErrors({});
        } catch (error) {
            toast.error(t("eventCreationFailed"));
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 md:max-w-3xl">
            <ToastContainer />
            <div className="bg-white shadow-md rounded-md p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">{t('createEvent')}</h1>
                <form onSubmit={handleSubmit}>
                    {/* English Fields */}
                    <div className="mb-4">
                        <label htmlFor="title_en" className="block text-md sm:text-lg font-bold mb-2">{t('titleEn')}</label>
                        <input
                            type="text"
                            name="title_en"
                            value={event.title_en}
                            onChange={handleInputChange}
                            required
                            className="block w-full px-3 py-2 border rounded shadow-sm"
                        />
                        {errors.title_en && <p className="text-red-500 text-xs mt-1">{errors.title_en}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description_en" className="block text-md sm:text-lg font-bold mb-2">{t('descriptionEn')}</label>
                        <textarea
                            name="description_en"
                            value={event.description_en}
                            onChange={handleInputChange}
                            required
                            className="block w-full px-3 py-2 border rounded shadow-sm"
                        />
                        {errors.description_en && <p className="text-red-500 text-xs mt-1">{errors.description_en}</p>}
                    </div>
                    {/* French Fields */}
                    <div className="mb-4">
                        <label htmlFor="title_fr" className="block text-md sm:text-lg font-bold mb-2">{t('titleFr')}</label>
                        <input
                            type="text"
                            name="title_fr"
                            value={event.title_fr}
                            onChange={handleInputChange}
                            required
                            className="block w-full px-3 py-2 border rounded shadow-sm"
                        />
                        {errors.title_fr && <p className="text-red-500 text-xs mt-1">{errors.title_fr}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description_fr" className="block text-md sm:text-lg font-bold mb-2">{t('descriptionFr')}</label>
                        <textarea
                            name="description_fr"
                            value={event.description_fr}
                            onChange={handleInputChange}
                            required
                            className="block w-full px-3 py-2 border rounded shadow-sm"
                        />
                        {errors.description_fr && <p className="text-red-500 text-xs mt-1">{errors.description_fr}</p>}
                    </div>
                    {/* Arabic Fields */}
                    <div className="mb-4">
                        <label htmlFor="title_ar" className="block text-md sm:text-lg font-bold mb-2">{t('titleAr')}</label>
                        <input
                            type="text"
                            name="title_ar"
                            value={event.title_ar}
                            onChange={handleInputChange}
                            required
                            className="block w-full px-3 py-2 border rounded shadow-sm"
                        />
                        {errors.title_ar && <p className="text-red-500 text-xs mt-1">{errors.title_ar}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description_ar" className="block text-md sm:text-lg font-bold mb-2">{t('descriptionAr')}</label>
                        <textarea
                            name="description_ar"
                            value={event.description_ar}
                            onChange={handleInputChange}
                            required
                            className="block w-full px-3 py-2 border rounded shadow-sm"
                        />
                        {errors.description_ar && <p className="text-red-500 text-xs mt-1">{errors.description_ar}</p>}
                    </div>
                    {/* Date and Location */}
                    <div className="mb-4">
                        <label htmlFor="date" className="block text-md sm:text-lg font-bold mb-2">{t('date')}</label>
                        <input
                            type="date"
                            name="date"
                            value={event.date}
                            onChange={handleInputChange}
                            required
                            className="block w-full px-3 py-2 border rounded shadow-sm"
                        />
                        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="location" className="block text-md sm:text-lg font-bold mb-2">{t('location')}</label>
                        <input
                            type="text"
                            name="location"
                            value={event.location}
                            onChange={handleInputChange}
                            required
                            className="block w-full px-3 py-2 border rounded shadow-sm"
                        />
                        {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                    </div>
                    {/* Image Upload */}
                    <div className="mb-4">
                        <label htmlFor="image" className="block text-md sm:text-lg font-bold mb-2">{t('image')}</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            required
                            className="block w-full px-3 py-2 border rounded shadow-sm"
                        />
                        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                    </div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        {t('submit')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateEventPage;