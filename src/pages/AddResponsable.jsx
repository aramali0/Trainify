import React, { useState } from 'react';
import axiosInstanceForRessources from '../helper/axiosForResoures';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { ClipLoader } from 'react-spinners';

const AddResonsablePage = ({setShowResponsableForm,setShowEntreprisesForm,setEntreprise}) => {

    const {t} = useTranslation('auth/addResponsable/addResponsable');

    const [matricule, setMatricule] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [num, setNum] = useState('');
    const [gender, setGender] = useState('MALE');
    const [age, setAge] = useState('');
    const [cin, setCin] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});
    const isRTL = i18next.language === 'ar';
    const handleImageChange = (e) => {
    
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setErrors({ image: 'Image size should not exceed 2 MB' });
                setProfileImage(null);
                setPreviewImage(null);
                return;
            } else {
                setErrors({ image: '' });
                setProfileImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewImage(reader.result);
                };
                reader.readAsDataURL(file);
            }
        } else {
            setPreviewImage(null);
        }
    };

    const validateCIN = (cin) => {
        const cinRegex = /^[A-Z]{1,2}[0-9]{4,9}$/;
        return cinRegex.test(cin);
    };

 const validateForm = () => {
        const newErrors = {};
        const nameRegex = /^[A-Za-z\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!firstName.trim()) newErrors.firstName = t('add_responsable.errors.first_name_required');
        else if (!nameRegex.test(firstName)) newErrors.firstName = t('add_responsable.errors.first_name_letters');

        if (!lastName.trim()) newErrors.lastName = t('add_responsable.errors.last_name_required');
        else if (!nameRegex.test(lastName)) newErrors.lastName = t('add_responsable.errors.last_name_letters');

        if (!email.trim()) newErrors.email = t('add_responsable.errors.email_required');
        else if (!emailRegex.test(email)) newErrors.email = t('add_responsable.errors.email_invalid');

        if (!matricule.trim()) newErrors.matricule = t('add_responsable.errors.matricule_required');

        if (!password) newErrors.password = t('add_responsable.errors.password_required');
        else if (password.length < 8) newErrors.password = t('add_responsable.errors.password_short');

        if (!num.trim()) newErrors.num = t('add_responsable.errors.phone_required');
        else if (num.length < 10) newErrors.num = t('add_responsable.errors.phone_invalid');

        if (!age.trim()) newErrors.age = t('add_responsable.errors.age_required');
        else if (isNaN(age) || age < 0) newErrors.age = t('add_responsable.errors.age_invalid');

        if (cin && !/^[A-Za-z]{1,3}\d{3,10}$/.test(cin)) newErrors.cin = t('add_responsable.errors.cin_invalid');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append('matriculeId', matricule);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('num', num);
        formData.append('gender', gender);
        formData.append('age', age);
        formData.append('cin', cin);
        formData.append('image', profileImage);

        try {
            const response = await axiosInstanceForRessources.post('/auth/responsable', formData);
           console.log("responsble : ",response.data) 
            setShowResponsableForm(false);
            setShowEntreprisesForm(true);
            setEntreprise(prevState => ({
                ...prevState,
                responsableFormationIds: [ ...prevState.responsableFormationIds, response.data.userId]
            }));

            toast.success(t('add_responsable.addUserSuccess'));
        } catch (error) {
          if(error.response?.data) 
            {
                toast.error(error.response.data.split(":")[1], { position: "top-right" });
            }
            else{
            console.error('Error adding user:', error);
            toast.error(t('add_responsable.addUserError'), { position: "top-right" });
            }
        }
    };


    return (
            <div className={isRTL ? "text-right" : "text-left"}>
            <ToastContainer />
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    <span>{t('add_responsable.no_image')}</span>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            id="profileImage"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                    <label
                        htmlFor="profileImage"
                        className="mt-2 text-sm text-indigo-600 hover:underline cursor-pointer"
                    >
                    {t('add_responsable.upload_image')}
                    </label>
                </div>

                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {t('add_responsable.title')}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {t('add_responsable.description')}
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="matricule" className="sr-only">
                                {t('add_responsable.matricule')}
                            </label>
                            <input
                                id="matricule"
                                name="matricule"
                                type="text"
                                required
                                className={`appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                                placeholder={t('add_responsable.matricule')}
                                value={matricule}
                                onChange={(e) => setMatricule(e.target.value)}
                            />
                            {errors.matricule && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="firstName" className="sr-only">
                                {t('add_responsable.first_name')}
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                required
                                className={`appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                                placeholder={t('add_responsable.first_name')}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="lastName" className="sr-only">
                                {t('add_responsable.last_name')}
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                required
                                className={`appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                                placeholder={t('add_responsable.last_name')}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="sr-only">
                                {t('add_responsable.email')}
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className={`appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                                placeholder={t('add_responsable.email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="sr-only">
                                {t('add_responsable.password')}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className={`appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                                placeholder={t('add_responsable.password')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="phone" className="sr-only">
                                {t('add_responsable.phone')}
                            </label>
                            <PhoneInput
                                country={'ma'} // Default country for phone number
                                value={num}
                                onChange={(phone) => setNum(phone)}
                                inputStyle={{ width: '100%' }}
                            />
                            {errors.num && <p className="text-red-500 text-xs mt-1">{errors.num}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="age" className="sr-only">
                                {t('add_responsable.age')}
                            </label>
                            <input
                                id="age"
                                name="age"
                                type="number"
                                required
                                className={`appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                                placeholder={t('add_responsable.age')}
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                        </div>

                        <div className='mb-4' >
                            <label htmlFor="age" className="sr-only">
                                {t('add_responsable.cin')}
</label>
                            <input
                                id="cin"
                                type="text"
                                name="cin"
                                required
                                value={cin}
                                placeholder={t('add_responsable.cin')}
                                onChange={(e) => setCin(e.target.value)}
                                className={`appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                            />
                            {errors.cin && <p className="text-red-500 text-sm mt-1">{errors.cin}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="gender" className="sr-only">
                                {t('add_responsable.gender')}
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                className={`appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="MALE">{t('add_responsable.male')}</option>
                                <option value="FEMALE">{t('add_responsable.female')}</option>
                            </select>
                        </div>

                    </div>

                    <div>
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
                            {t('add_responsable.loading')}
                        </>
                    ) : (
                        t('add_responsable.submit')
                    )}
                </button>
                    </div>
                </form>
        </div>
    );
};

export default AddResonsablePage;
