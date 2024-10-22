import React, { useState, useEffect } from 'react';
import axiosInstanceForRessources from '../helper/axiosForResoures';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { ClipLoader } from 'react-spinners'; // Import a spinner component
import { useTranslation } from 'react-i18next';

const customStyles = {
    container: (provided) => ({
        ...provided,
        marginTop: '0.25rem',
        marginBottom: '0.25rem',
    }),
    control: (provided) => ({
        ...provided,
        border: '1px solid #d1d5db', // Tailwind's border-gray-300
        borderRadius: '0.375rem', // Tailwind's rounded-md
        boxShadow: 'none',
        '&:hover': {
            border: '1px solid #4f46e5', // Tailwind's focus:ring-indigo-500
        },
        '&:focus': {
            border: '1px solid #4f46e5', // Tailwind's focus:ring-indigo-500
        },
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#6b7280', // Tailwind's placeholder-gray-500
    }),
    menu: (provided) => ({
        ...provided,
        borderRadius: '0.375rem', // Tailwind's rounded-md
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#4f46e5' : null, // Tailwind's bg-indigo-600
        color: state.isSelected ? '#ffffff' : '#1f2937', // Tailwind's text-white / text-gray-900
        '&:hover': {
            backgroundColor: '#a5b4fc', // Tailwind's bg-indigo-100
            color: '#1f2937', // Tailwind's text-gray-900
        },
    }),
};

const AddParticipantPage = () => {
    const navigate = useNavigate();
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
    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [entreprises, setEntreprises] = useState([]);
    const [selectedEntreprise, setSelectedEntreprise] = useState('');
    const [unitName, setUnitName] = useState('');
    const [units, setUnits] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const { t } = useTranslation('auth/add-user');

    useEffect(() => {
        const fetchEntreprises = async () => {
            try {
                const response = await axiosInstanceForRessources.get('/entreprises');
                setEntreprises(response.data);
            } catch (error) {
                console.error('Error fetching entreprises:', error);
                toast.error('Failed to fetch entreprises', { position: "top-right" });
            }
        };
        fetchEntreprises();
    }, []);


  useEffect(() => {
        if (selectedEntreprise) {
            axiosInstanceForRessources.get(`/hierarchical-units/entreprise/${selectedEntreprise}/leafs`)
                .then(response => {
                    setUnits(response.data.map(f => ({ value: f.name, label: f.name})));
                    console.log("units : ",response.data);
                })
                .catch(error => console.error('Error fetching units leafs:', error));
        } else {
            setUnits([]); // Clear units if no entreprise is selected
            setUnitName(''); // Reset selected unit
        }
    }, [selectedEntreprise]);

    const validateCIN = (cin) => {
        const cinRegex = /^[A-Z]{1,2}[0-9]{4,9}$/;
        return cinRegex.test(cin);
    };

const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName.trim()) newErrors.firstName = t('validate.firstNameRequired');
    else if (!nameRegex.test(firstName)) newErrors.firstName = t('validate.firstNameLetters');

    if (!lastName.trim()) newErrors.lastName = t('validate.lastNameRequired');
    else if (!nameRegex.test(lastName)) newErrors.lastName = t('validate.lastNameLetters');

    if (!email.trim()) newErrors.email = t('validate.emailRequired');
    else if (!emailRegex.test(email)) newErrors.email = t('validate.emailValid');

    if (!matricule.trim()) newErrors.matricule = t('validate.matriculeRequired');

    if (!password) newErrors.password = t('validate.passwordRequired');
    else if (password.length < 8) newErrors.password = t('validate.passwordLength');

    if (!num.trim()) newErrors.num = t('validate.phoneRequired');
    else if (num.replace(/\D/g, '').length < 10) newErrors.num = t('validate.phoneValid');

    if (!age) newErrors.age = t('validate.ageRequired');
    else if (!/^\d+$/.test(age)) newErrors.age = t('validate.ageValid');
    else if (age <= 0 || age > 120) newErrors.age = t('validate.ageRange');

    if (!validateCIN(cin)) newErrors.CIN = t("validate.cinFormat");

    if (!selectedEntreprise) newErrors.selectedEntreprise = t('validate.selectEntreprise');

    if (!unitName) newErrors.unitName = t('validate.selectUnit');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setErrors({ ...errors, image: 'Image size should not exceed 2 MB' });
                setProfileImage(null);
                setPreviewImage(null);
                return;
            } else {
                setErrors({ ...errors, image: '' });
                setProfileImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewImage(reader.result);
                };
                reader.readAsDataURL(file);
            }
        } else {
            setPreviewImage(null);
            setProfileImage(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setIsLoading(true); // Start loading

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
        if (profileImage) {
            formData.append('image', profileImage);
        }
        formData.append('entrepriseId', selectedEntreprise);
        formData.append('unitName', unitName);

        try {
            await axiosInstanceForRessources.post('/auth/participant', formData);
            toast.success('Participant added successfully!', { position: "top-right" });
            navigate(`/activation/${email}`);
        } catch (error) {
            if (error.response && error.response.data) {
                console.error('Error adding user:', error.response.data);
                toast.error(error.response.data, { position: "top-right" });
            } else {
                console.error('Error adding user:', error);
                toast.error('Failed to add user', { position: "top-right" });
            }
        } finally {
            setIsLoading(false); // End loading
        }
    };

    const entreprisesOptions = entreprises.map((entreprise) => ({
        value: entreprise.nomCommercial,
        label: entreprise.nomCommercial
    }));

    const unitsOptions = units.map((unit) => ({
        value: unit.value,
        label: unit.label
    }));

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer />
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
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
                                    <span>{t('addParticipant.noImage')}</span>
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
                    {t('addParticipant.uploadImage')}
                    </label>
                </div>

                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {t('addParticipant.title')}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                    {t('addParticipant.description')}
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Matricule Input */}
                    <div className="mb-4">
                        <input
                            id="matricule"
                            name="matricule"
                            type="text"
                            required
                            className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                                errors.matricule ? 'border-red-500' : 'border-gray-300'
                            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                            placeholder= {t('addParticipant.fields.matricule')}
                            value={matricule}
                            onChange={(e) => setMatricule(e.target.value)}
                            disabled={isLoading} // Disable input when loading
                        />
                        {errors.matricule && <p className="text-red-500 text-xs mt-1">{errors.matricule}</p>}
                    </div>
                    
                    {/* First Name Input */}
                    <div className="mb-4">
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            autoComplete="given-name"
                            required
                            className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                                errors.firstName ? 'border-red-500' : 'border-gray-300'
                            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                            placeholder= {t('addParticipant.fields.firstName')}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            disabled={isLoading}
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    
                    {/* Last Name Input */}
                    <div className="mb-4">
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            autoComplete="family-name"
                            required
                            className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                                errors.lastName ? 'border-red-500' : 'border-gray-300'
                            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                            placeholder= {t('addParticipant.fields.lastName')}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            disabled={isLoading}
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                    
                    {/* Email Input */}
                    <div className="mb-4">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                            placeholder= {t('addParticipant.fields.email')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    
                    {/* Password Input */}
                    <div className="mb-4">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                                errors.password ? 'border-red-500' : 'border-gray-300'
                            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                            placeholder= {t('addParticipant.fields.password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    
                    {/* Phone Number Input */}
                    <div className="mb-4">
                        <PhoneInput
                            country={'ma'}
                            value={num}
                            onChange={setNum}
                            inputProps={{
                                name: 'num',
                                required: true,
                                autoComplete: 'tel',
                                className: `appearance-none rounded-md relative block w-full px-3 py-2 border ${
                                    errors.num ? 'border-red-500' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`
                            }}
                            disabled={isLoading}
                        />
                        {errors.num && <p className="text-red-500 text-xs mt-1">{errors.num}</p>}
                    </div>
                    
                    {/* Entreprise Select */}
                    <div className="mb-4">
                        <Select
                            options={entreprisesOptions}
                            onChange={(option) => setSelectedEntreprise(option ? option.value : '')}
                            placeholder= {t('addParticipant.fields.entreprise')}
                            styles={customStyles}
                            isDisabled={isLoading}
                            isClearable
                        />
                        {errors.selectedEntreprise && <p className="text-red-500 text-xs mt-1">{errors.selectedEntreprise}</p>}
                    </div>
                    
                    {/* Age Input */}
                    <div className="mb-4">
                        <input
                            id="age"
                            name="age"
                            type="number"
                            autoComplete="age"
                            required
                            className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                                errors.age ? 'border-red-500' : 'border-gray-300'
                            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                            placeholder= {t('addParticipant.fields.age')}
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            disabled={isLoading}
                        />
                        {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                    </div>
                    
                    {/* CIN Input */}
                    <div className="mb-4">
                        <input
                            id="cin"
                            name="cin"
                            type="text"
                            autoComplete="cin"
                            required
                            className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                                errors.CIN ? 'border-red-500' : 'border-gray-300'
                            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                            placeholder= {t('addParticipant.fields.cin')}
                            value={cin}
                            onChange={(e) => setCin(e.target.value)}
                            disabled={isLoading}
                        />
                        {errors.CIN && <p className="text-red-500 text-xs mt-1">{errors.CIN}</p>}
                    </div>

                    {/* Unit Select */}
                    <div className="mb-4">
                        <Select
                            options={unitsOptions}
                            onChange={(option) => setUnitName(option ? option.value : '')}
                            placeholder= {t('addParticipant.fields.unit')}
                            styles={customStyles}
                            isDisabled={isLoading || !selectedEntreprise}
                            isClearable
                        />
                        {errors.unitName && <p className="text-red-500 text-xs mt-1">{errors.unitName}</p>}
                    </div>
                                <div className="mb-4">
                    <label htmlFor="gender" className="sr-only">
                        {t("add_responsable.gender")}
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        className={`appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
                        isRTL ? "text-right" : "text-left"
                        }`}
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <option value="MALE">{t("add_responsable.male")}</option>
                        <option value="FEMALE">{t("add_responsable.female")}</option>
                    </select>
            </div>
                    {/* Submit Button */}
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
                                        {t('addParticipant.submit.adding')}
                                </>
                            ) : (
                                <>
                                        {t('addParticipant.submit.addParticipant')}
                                        </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddParticipantPage;
