import React, { useState, useEffect } from 'react';
import axiosInstance from '../helper/axios';
import { toast, ToastContainer } from 'react-toastify';
import { getUser } from '../helper/auth';
import { Link } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
    const { t } = useTranslation('pages/profilePage');
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        num: '',
        gender: '',
        CIN: '',
        age: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [loadedImageUrl, setLoadedImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get(`/users/${getUser().userId}`);
                setUser(response.data);

                if (response.data.profileImagePath) {
                    const imageResponse = await axiosInstance.get(`/${response.data.profileImagePath}`, {
                        responseType: 'blob'
                    });
                    const imageUrl = URL.createObjectURL(imageResponse.data);
                    setLoadedImageUrl(imageUrl);
                } else {
                    setLoadedImageUrl("https://via.placeholder.com/150");  // Fallback image
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error(t('profilePage.loadingError'));
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [t]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLoadedImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const validateFirstName = (firstName) => {
        const nameRegex = /^[A-Za-z\s]+$/;
        return nameRegex.test(firstName.trim());
    };

    const validateLastName = (lastName) => {
        const nameRegex = /^[A-Za-z\s]+$/;
        return nameRegex.test(lastName.trim());
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (num) => {
        const phoneRegex = /^[0-9]{4,15}$/;
        return phoneRegex.test(num);
    };

    const validateCIN = (cin) => {
        const cinRegex = /^[A-Z]{1,2}[0-9]{4,9}$/;
        return cinRegex.test(cin);
    };

    const validateAge = (age) => {
        return !isNaN(age) && age > 0;
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!validateFirstName(user.firstName)) {
            newErrors.firstName = t('profilePage.validation.firstName');
        }
        if (!validateLastName(user.lastName)) {
            newErrors.lastName = t('profilePage.validation.lastName');
        }
        if (!validateEmail(user.email)) {
            newErrors.email = t('profilePage.validation.email');
        }
        if (!validatePhoneNumber(user.num)) {
            newErrors.num = t('profilePage.validation.phone');
        }
        if (!validateCIN(user.CIN)) {
            newErrors.CIN = t('profilePage.validation.cin');
        }
        if (!validateAge(user.age)) {
            newErrors.age = t('profilePage.validation.age');
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const formData = new FormData();
        formData.append('firstName', user.firstName);
        formData.append('lastName', user.lastName);
        formData.append('email', user.email);
        formData.append('num', user.num);
        formData.append('gender', user.gender.toUpperCase());
        formData.append('CIN', user.CIN);
        formData.append('age', user.age);

        if (profileImage) {
            formData.append('image', profileImage);
        }

        try {
            await axiosInstance.put('/users/update-profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success(t('profilePage.profileUpdateSuccess'));
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(t('profilePage.profileUpdateError'));
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-lg mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
            <ToastContainer />
            <h2 className="text-2xl font-semibold mb-6">{t('profilePage.title')}</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4" encType="multipart/form-data">
                <div className="text-center mb-6">
                    {loadedImageUrl ? (
                        <img src={loadedImageUrl} alt="Profile" className="w-24 h-24 rounded-full mx-auto" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto"></div>
                    )}
                    <input type="file" onChange={handleImageChange} className="mt-4" />
                </div>
                <div>
                    <label className="block text-gray-700">{t('profilePage.firstName')}</label>
                    <input
                        type="text"
                        name="firstName"
                        value={user.firstName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                    <label className="block text-gray-700">{t('profilePage.lastName')}</label>
                    <input
                        type="text"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
                <div>
                    <label className="block text-gray-700">{t('profilePage.email')}</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        disabled
                        required
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="phone" className="sr-only">{t('profilePage.phone')}</label>
                    <PhoneInput
                        country={'ma'} // Default country for phone number
                        value={user.num}
                        onChange={(phone) => setUser({ ...user, num: phone })}
                        inputStyle={{ width: '100%' }}
                    />
                    {errors.num && <p className="text-red-500 text-xs mt-1">{errors.num}</p>}
                </div>

                <div>
                    <label className="block text-gray-700">{t('profilePage.gender')}</label>
                    <select
                        name="gender"
                        value={user.gender}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">{t('profilePage.CIN')}</label>
                    <input
                        type="text"
                        name="CIN"
                        value={user.CIN}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    {errors.CIN && <p className="text-red-500 text-sm mt-1">{errors.CIN}</p>}
                </div>
                <div>
                    <label className="block text-gray-700">{t('profilePage.age')}</label>
                    <input
                        type="number"
                        name="age"
                        value={user.age}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    {t('profilePage.updateProfile')}
                </button>
            </form>
            <div className="mt-8 text-center">
                <Link
                    to="/responsable/change-password"
                    className="text-blue-500 hover:underline"
                >
                    {t('profilePage.changePassword')}
                </Link>
            </div>
        </div>
    );
};

export default ProfilePage;
