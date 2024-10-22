import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../helper/axios';
import { toast, ToastContainer } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select'; // Import react-select
import { useTranslation } from 'react-i18next';

const UpdateUserPage = () => {
    const { t, i18n } = useTranslation('pages/addUserPage');

    const roleOptions = useMemo(() => [
        { value: 'PARTICIPANT', label: t('participant') },
        { value: 'FORMATEUR', label: t('formateur') },
        { value: 'RESPONSABLE', label: t('responsable') },
        { value: 'CHARGE', label: t('charge') }
    ], [t]);  // Add 't' as a dependency

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        num: '',
        gender: 'MALE',
        CIN: '',
        age: '',
        roles: [],
        profileImagePath: ''
    });

    const [profileImage, setProfileImage] = useState(null);
    const [loadedImageUrl, setLoadedImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [selectedRoles, setSelectedRoles] = useState([]);

    // Move the language direction useEffect to the top
    useEffect(() => {
        const currentLang = i18n.language;
        if (currentLang === 'ar') {
            document.body.dir = 'rtl';
        } else {
            document.body.dir = 'ltr';
        }
    }, [i18n.language]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get(`/users/${id}`);
                const fetchedUser = response.data;
                setUser(fetchedUser);

                const selectedRoles = fetchedUser.roles.map(roleObj => ({
                    value: roleObj.role,  // Extract the 'role' from the object
                    label: roleOptions.find(option => option.value === roleObj.role)?.label || roleObj.role
                }));
                setSelectedRoles(selectedRoles);

                if (fetchedUser.profileImagePath) {
                    const imageResponse = await axiosInstance.get(`http://localhost:8087/api${fetchedUser.profileImagePath}`, {
                        responseType: 'blob'
                    });
                    const imageUrl = URL.createObjectURL(imageResponse.data);
                    setLoadedImageUrl(imageUrl);
                } else {
                    setLoadedImageUrl("https://via.placeholder.com/150");
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("Failed to load user data");
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [id, roleOptions]); // Added roleOptions as dependency

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

    const handleRoleChange = (selectedOptions) => {
        setSelectedRoles(selectedOptions);
        const rolesArray = selectedOptions.map(option => option.value);
        setUser({ ...user, roles: rolesArray });
    };

    const validateCIN = (cin) => {
        const cinRegex = /^[A-Za-z]{1,3}[0-9]{3,9}$/;
        return cinRegex.test(cin);
    };

    const validateForm = () => {
        const newErrors = {};
        const nameRegex = /^[A-Za-z\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const { firstName, lastName, email, num, age, CIN } = user;
        const password = user.password || ''; // Assuming password might be part of user

        if (!firstName.trim()) newErrors.firstName = t('validate.firstNameRequired');
        else if (!nameRegex.test(firstName)) newErrors.firstName = t('validate.firstNameLetters');

        if (!lastName.trim()) newErrors.lastName = t('validate.lastNameRequired');
        else if (!nameRegex.test(lastName)) newErrors.lastName = t('validate.lastNameLetters');

        if (!email.trim()) newErrors.email = t('validate.emailRequired');
        else if (!emailRegex.test(email)) newErrors.email = t('validate.emailValid');

        if (!user.matricule?.trim()) newErrors.matricule = t('validate.matriculeRequired');

        if (!password) newErrors.password = t('validate.passwordRequired');
        else if (password.length < 8) newErrors.password = t('validate.passwordLength');

        if (!num.trim()) newErrors.num = t('validate.phoneRequired');
        else if (num.length < 10) newErrors.num = t('validate.phoneLength');

        if (!age) newErrors.age = t('validate.ageRequired');
        else if (!/^\d+$/.test(age)) newErrors.age = t('validate.ageValide');
        else if (age <= 0 || age > 120) newErrors.age = t('validate.ageRange');

        if (!validateCIN(CIN)) newErrors.CIN = t('validate.cinFormat');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        if (Object.values(user).some(field => field === '')) {
            toast.error("All fields are required");
            return;
        }

        // if (!validateForm()) {
        //     toast.error("All fields are required");
        //     return;
        // }

        const formData = new FormData();
        formData.append('firstName', user.firstName);
        formData.append('lastName', user.lastName);
        formData.append('email', user.email);
        formData.append('num', user.num);
        formData.append('gender', user.gender.toUpperCase());
        formData.append('CIN', user.CIN);
        formData.append('age', user.age);

        // Append roles array to formData
        user.roles.forEach(role => formData.append('roles', role?.role || role));

        console.log("role :",user);
        if (profileImage) {
            formData.append('image', profileImage);
        }

        try {
            await axiosInstance.put(`/users/update-profile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("User updated successfully!");
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Failed to update user");
        }
    };

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/users/${id}`);
            toast.success("User deleted successfully!");
            navigate('/users'); // Redirect to users list
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user");
        }
    };

    const handleBlock = async () => {
        try {
            await axiosInstance.put(`/users/${id}/block`);
            toast.success("User blocked successfully!");
        } catch (error) {
            console.error("Error blocking user:", error);
            toast.error("Failed to block user");
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-lg mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
            <ToastContainer />
            {/* <h2 className="text-2xl font-semibold mb-6">Update User</h2> */}
            <form onSubmit={handleProfileSubmit} className="space-y-4" encType="multipart/form-data">
                <div className="relative text-center mb-6">
                    {loadedImageUrl ? (
                        <img src={loadedImageUrl} alt="Profile" className="w-24 h-24 rounded-full mx-auto" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto"></div>
                    )}
                    <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                <div>
                    <label className="block text-gray-700">{t('firstName')}</label>
                    <input
                        type="text"
                        name="firstName"
                        value={user.firstName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                <div>
                    <label className="block text-gray-700">{t('lastName')}</label>
                    <input
                        type="text"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                <div>
                    <label className="block text-gray-700">{t('email')}</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        disabled
                        required
                    />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                <div>
                    <label className="block text-gray-700">{t('phone')}</label>
                    <input
                        type="text"
                        name="num"
                        value={user.num}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>
                {errors.num && <p className="text-red-500 text-xs mt-1">{errors.num}</p>}
                <div>
                    <label className="block text-gray-700">{t('gender')}</label>
                    <select
                        name="gender"
                        value={user.gender}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    >
                        <option value="MALE">{t('male')}</option>
                        <option value="FEMALE">{t('female')}</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">{t('cin')}</label>
                    <input
                        type="text"
                        name="CIN"
                        value={user.CIN}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>
                {errors.CIN && <p className="text-red-500 text-sm mt-1">{errors.CIN}</p>}
                <div>
                    <label className="block text-gray-700">{t('age')}</label>
                    <input
                        type="number"
                        name="age"
                        value={user.age}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                {/* Roles select */}
                <div className="mb-4">
                    <label htmlFor="roles" className="block text-gray-700">{t('role')}</label>
                    <Select
                        id="roles"
                        isMulti
                        options={roleOptions}
                        value={selectedRoles}
                        onChange={handleRoleChange}
                        className="w-full"
                        classNamePrefix="react-select"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    {t('addUser')}
                </button>
            </form>
        </div>
    );
};

export default UpdateUserPage;
