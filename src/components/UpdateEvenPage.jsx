import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstanceForRessources from '../helper/axiosForResoures';
import axiosInstance from '../helper/axios';
import { useTranslation } from 'react-i18next';

const UpdateEventPage = () => {
    const { id } = useParams();
    const { t } = useTranslation('pages/updateEventPage'); // Use the translation hook
    const [event, setEvent] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        image: null,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axiosInstance.get(`/events/${id}`)
            .then(response => {
                const data = response.data;
                setEvent({
                    title: data.title,
                    description: data.description,
                    date: new Date(data.date).toISOString().split('T')[0],
                    location: data.location,
                    image: data.imagePath,
                });
            })
            .catch(error => toast.error(t('errorFetchingEvent')));
    }, [id, t]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEvent(prevState => ({ ...prevState, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setEvent(prevState => ({ ...prevState, image: file }));
    };

    const validateForm = () => {
        const newErrors = {};
        const textRegex = /^[a-zA-Z0-9,.!? ]+$/;

        if (!event.title.match(textRegex)) {
            newErrors.title = t('titleValidation');
        }
        if (!event.description.match(textRegex)) {
            newErrors.description = t('descriptionValidation');
        }
        if (!event.location.match(textRegex)) {
            newErrors.location = t('locationValidation');
        }

        const today = new Date().toISOString().split('T')[0];
        if (event.date < today) {
            newErrors.date = t('datePast');
        }

        if (event.image && event.image instanceof File) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(event.image.type)) {
                newErrors.image = t('imageValidation');
            }
            if (event.image.size > 5 * 1024 * 1024) { // 5MB limit
                newErrors.image = t('imageSizeLimit');
            }
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const formData = new FormData();
        Object.keys(event).forEach(key => {
            formData.append(key, event[key]);
        });

        try {
            await axiosInstanceForRessources.put(`/events/${id}`, formData);
            toast.success(t("eventUpdated"));
        } catch (error) {
            toast.error(t("eventUpdateFailed"));
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md" dir={t('direction')}>
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-6">{t('updateEvent')}</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="title">{t('title')}</label>
                    <input
                        type="text"
                        name="title"
                        value={event.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="description">{t('description')}</label>
                    <textarea
                        name="description"
                        value={event.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="date">{t('date')}</label>
                    <input
                        type="date"
                        name="date"
                        value={event.date}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="location">{t('location')}</label>
                    <input
                        type="text"
                        name="location"
                        value={event.location}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="image">{t('eventImage')}</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className="w-full p-2 border rounded"
                        accept="image/*"
                    />
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{t('updateEvent')}</button>
            </form>
        </div>
    );
};

export default UpdateEventPage;
