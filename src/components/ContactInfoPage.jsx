import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../helper/axios';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

const ContactInfoPage = () => {
    const { t } = useTranslation('pages/ContactInfoPge'); // Use the translation hook
    const [contactInfo, setContactInfo] = useState({
        email: '',
        location: '',
        phone: '',
    });

    const [errors, setErrors] = useState({}); // To track validation errors

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const response = await axiosInstance.get('/contact-info');
                setContactInfo(response.data);
            } catch (error) {
                console.error(t('errorFetchingContactInfo'), error);
            }
        };

        fetchContactInfo();
    }, [t]);


    const validateForm = () => {
        const newErrors = {};

        // Validate email format
        if (!contactInfo.email.match(/^\S+@\S+\.\S+$/)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        // Validate phone (only numbers allowed)
        if (!contactInfo.phone.match(/^\d+$/)) {
            newErrors.phone = 'Phone number should contain only numbers.';
        }

        // Validate location (letters, numbers, commas, and periods allowed)
        if (!contactInfo.location.match(/^[a-zA-Z0-9,. ]+$/)) {
            newErrors.location = 'Location should contain only letters, numbers, commas, periods, and spaces.';
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactInfo({ ...contactInfo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form before submission
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            await axiosInstance.put('/contact-info', contactInfo);
            toast.success(t('contactInfoUpdated'));
            setErrors({}); // Clear errors on successful submission
        } catch (error) {
            console.error(t('errorUpdatingContactInfo'), error);
            toast.error(t('failedToUpdateContactInfo'));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6 px-4" dir={t('direction')}>
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('updateContactInformation')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-600">{t('email')}:</label>
                        <input
                            type="email"
                            name="email"
                            value={contactInfo.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Location */}
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-600">{t('location')}:</label>
                        <input
                            type="text"
                            name="location"
                            value={contactInfo.location}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.location && (
                            <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-600">{t('phone')}:</label>
                        <input
                            type="text"
                            name="phone"
                            value={contactInfo.phone}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {t('update')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactInfoPage;
