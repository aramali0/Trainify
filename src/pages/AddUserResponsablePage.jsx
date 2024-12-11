import React, { useEffect, useState } from 'react';
import axiosInstanceForRessources from '../helper/axiosForResoures';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import * as XLSX from 'xlsx';
import { FaSpinner } from 'react-icons/fa'; 
import Select from 'react-select';
import { getUser } from '../helper/auth';
import axiosInstance from '../helper/axios';
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

const AddUserPage = ({path}) => {
const [matricule, setMatricule] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [num, setNum] = useState('');
    const [gender, setGender] = useState('MALE');
    const [role, setRole] = useState('PARTICIPANT');
    const [age, setAge] = useState('');
    const [cin, setCin] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [entreprises, setEntreprises] = useState([]);
    const [unitName, setUnitName] = useState('');
    const [units, setUnits] = useState([]);
    const [user, setUser] = useState([]);
    const [entreprise,setEntreprise] = useState([]);
    const { t, i18n } = useTranslation('pages/addUserPage');
    // State for Formateur
    const [typeFormateur, setTypeFormateur] = useState('INTERNE');
    const [cabinetName, setCabinetName] = useState('');
    const [cabinetNum, setCabinetNum] = useState('');

    const id = getUser().userId

    // Fetch entreprises if role is participant
    useEffect(() => {
            axiosInstanceForRessources.get('/entreprises')
                .then(response => setEntreprises(response.data))
                .catch(error => console.error('Error fetching entreprises:', error));
    }, []);

    const getUserPath = async () => {
        try {
            const response = await axiosInstanceForRessources.get(`${path}/${id}`);
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

        const fetchEntreprise = async () => {
        try {
            const response = await axiosInstance.get(`${path}/${id}/entreprise`);
            setEntreprise(response.data);
        } catch (error) {
            console.error('Error fetching entreprise data:', error);
        }
    };

  useEffect(
    () => {
        getUserPath();
        if (user.entrepriseId && role === "PARTICIPANT") {
            axiosInstanceForRessources.get(`/hierarchical-units/entreprise/${user.entrepriseId}/leafs`)
                .then(response => {
                    setUnits(response.data.map(f => ({ value: f.name, label: f.name})));
                })
                .catch(error => console.error('Error fetching units leafs:', error));
        }
        fetchEntreprise();

    }, [user.entrepriseId,role]);


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

        if (!firstName.trim()) newErrors.firstName =t('validate.firstNameRequired')
        else if (!nameRegex.test(firstName)) newErrors.firstName = t('validate.firstNameLetters');

        if (!lastName.trim()) newErrors.lastName = t('validate.lastNameRequired');
        else if (!nameRegex.test(lastName)) newErrors.lastName = t('validate.lastNameLetters');

        if (!email.trim()) newErrors.email = t('validate.emailRequired');
        else if (!emailRegex.test(email)) newErrors.email = t('validate.emailValid');

        if (!matricule.trim()) newErrors.matricule = t('validate.matriculeRequired');

        if (!password) newErrors.password = t('validate.passwordRequired');
        else if (password.length < 8) newErrors.password = t('validate.passwordLength');

        if (!num.trim()) newErrors.num = t('validate.phoneRequired');
        else if (num.length < 10) newErrors.num = t('validate.phoneLength');

        if (!age) newErrors.age = t('validate.ageRequired');
        else if (!/^\d+$/.test(age)) newErrors.age = t('validate.ageValide');
        else if (age <= 0 || age > 120) newErrors.age = t('validate.ageRange');

        if (!validateCIN(cin)) newErrors.CIN = t('validate.cinFormat');

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
        formData.append('role', role);
        formData.append('image', profileImage);
        // Add formateur-specific fields
        if (role === 'FORMATEUR') {
            formData.append('typeFormateur', typeFormateur);
            formData.append('cabinetName', cabinetName);
            formData.append('cabinetNum', cabinetNum);
        }

        // Add participant-specific fields
        if (role === 'PARTICIPANT') {
            formData.append('unitName', unitName);
        }

        try {
            await axiosInstanceForRessources.post('/auth/register-responsable', formData);
            toast.success('User added successfully', { position: 'top-right' });
            setMatricule('');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setNum('');
            setCin('');
            setGender('MALE');
            setAge('');
            setProfileImage(null);
            setPreviewImage(null);
            setErrors({});
            setRole('RESPONSABLE');
            } catch (error) {
                if(error.response.data) 
                {
                     toast.error(error.response.data.split(":")[1], { position: "top-right" });
                }
                else{
                    console.error('Error adding user:', error);
                toast.error('Failed to add user', { position: "top-right" });
                }
            }    
    };


    const entreprisesOptions = entreprises.map((entreprise) => ({
        value: entreprise.id,
        label: entreprise.nomCommercial
    }));
    // New function to handle Excel file upload
const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        try {
            for (let i = 0; i < jsonData.length; i++) {
                const user = jsonData[i];
                const formData = new FormData();

                // Append common fields
                formData.append('matriculeId', user.matricule);
                formData.append('firstName', user.firstname);
                formData.append('lastName', user.lastname);
                formData.append('email', user.email);
                formData.append('password', user.password);
                formData.append('num', user.num);
                formData.append('gender', user.gender);
                formData.append('age', user.age);
                formData.append('cin', user.cin);
                formData.append('role', user.role);

                // Handle additional fields based on role
                if (user.role === 'FORMATEUR') {
                    formData.append('typeFormateur', user.typeFormateur);
                    if (user.typeFormateur && user.typeFormateur.toUpperCase() === 'EXTERN') {
                        formData.append('cabinetName', user.cabinetName || '');
                        formData.append('cabinetNum', user.cabinetNum || '');
                    }
                } else if (user.role === 'PARTICIPANT') {
                    formData.append('filiale', user.filiale || '');
                    formData.append('pole', user.pole || '');
                    formData.append('direction', user.direction || '');
                    formData.append('departement', user.departement || '');
                }

                // Handle image if available
                if (user.image) {
                    const file = user.image; // assuming image is included in the Excel as a base64 or file path
                    formData.append('image', file); 
                }

                // Make the API call
                await axiosInstanceForRessources.post('/auth/register-responsable', formData);
            }
            toast.success('All users added successfully', { position: 'top-right' });
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.split(":")[1], { position: "top-right" });
            } else {
                console.error('Error adding user:', error);
                toast.error('Failed to add user', { position: "top-right" });
            }
        } finally {
            setIsUploading(false); // Hide spinner after file processing
        }
    };

    reader.readAsArrayBuffer(file);
};



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
                                    <span>{t('noImage')}</span>
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
                        {t('uploadImage')}
                    </label>
                </div>

                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {t('addNewUser')}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {t('fillDetails')}
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="firstName" className="sr-only">
                                {t('matriculeId')}
                            </label>
                            <input
                                id="matricule"
                                name="matricule"
                                type="text"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder=
                                {t('matriculeId')}
                                value={matricule}
                                onChange={(e) => setMatricule(e.target.value)}
                            />
                            {errors.matricule && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="firstName" className="sr-only">
                                {t('firstName')}
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder=
                                {t('firstName')}

                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="lastName" className="sr-only">
                                    {t('lastName')}
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder={t('lastName')}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="sr-only">
                                {t('email')}
</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder=
                                {t('email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="sr-only">
                                {t('password')}
</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder=
                                {t('password')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="phone" className="sr-only">
                                {t('phoneNumber')}
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
                                {t('age')}
                                 </label>
                            <input
                                id="age"
                                name="age"
                                type="number"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder=
                                {t('age')}
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                        </div>

                        <div className='mb-4' >
                            <label htmlFor="age" className="sr-only">
                                {t('cin')}
</label>
                            <input
                                id="cin"
                                type="text"
                                name="cin"
                                required
                                value={cin}
                                placeholder=
                                {t('cin')}
                                onChange={(e) => setCin(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            />
                            {errors.CIN && <p className="text-red-500 text-sm mt-1">{errors.CIN}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="gender" className="sr-only">
                                {t('gender')}
</label>
                            <select
                                id="gender"
                                name="gender"
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="MALE">
                                {t('male')}
</option>
                                <option value="FEMALE">
                                {t('female')}
</option>
                            </select>
                        </div>


                        <div className="mb-4">

                            <label htmlFor="role" className="sr-only">
                                {t('role')}
</label>
                            <select
                                id="role"
                                name="role"
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="PARTICIPANT">
                                {t('participant')}
</option>
                                <option value="FORMATEUR">
                                {t('formateur')}
</option>
                                <option value="RESPONSABLE">
                                {t('responsable')}
</option>
                            </select>
                        </div>
          {/* Conditionally render Formateur fields */}
            {role === 'FORMATEUR' && (
            <div>
                    <div className='mb-4'>
                        <select id="typeFormateur"
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={typeFormateur} onChange={(e) => setTypeFormateur(e.target.value)}>
                            <option value="INTERNE">
                                {t('interne')}

</option>
                            <option value="EXTERNE">
                                {t('externe')}
</option>
                        </select>
                    </div>
                    {typeFormateur === 'EXTERNE' && (
                <div>
                    <div className='mb-4'>
                        <input type="text" id="cabinetName"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder={t('cabinetName')}
                         value={cabinetName} onChange={(e) => setCabinetName(e.target.value)} />
                    </div>

                        <div className="mb-4">
                            <label htmlFor="phone">{t('cabinetPhone')}</label>
                            <PhoneInput
                                country={'ma'} // Default country for phone number
                                value={cabinetNum}
                                onChange={(phone) => setCabinetNum(phone)}
                                inputStyle={{ width: '100%' }}
                            />
                            {errors.cabinetNum && <p className="text-red-500 text-xs mt-1">{errors.cabinetNum}</p>}
                        </div>
                    </div>
                )}
                </div>
            )}
            {/* Conditionally render Participant fields */}
            {role === 'PARTICIPANT' && (
                <div>
                    <div className="mb-4">
                        <Select
                            options={units}
                            onChange={(option) => setUnitName(option.value)}
                            placeholder="Select Unit"
                            styles={customStyles}
                        />
                    </div>
                </div>
            )}
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
{t('addUser')}
                        </button>
                    </div>
            
            </div>
                </form>
            {entreprise?.showExcelMethode && (
                <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-6 space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                        <button
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-lg shadow-md hover:from-purple-500 hover:to-indigo-600 transition duration-300 ease-in-out transform hover:scale-105"
                            onClick={() => {
                             axiosInstanceForRessources.get('/generate-template', { responseType: 'blob' })
                            .then(response => {
                                const url = window.URL.createObjectURL(new Blob([response.data]));
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', 'User_Template.xlsx');
                                document.body.appendChild(link);
                                link.click();
                            })
                            .catch(err => {
                            console.error('Error downloading template', err); // Already exists
                            console.error('Response data:', err.response); // Log detailed error response
                            console.error('Error message:', err.message);
                        });

                            }}
                        >
                            {t('downloadtemplate')}
                        </button>
                        <h3 className="text-xl font-semibold text-gray-800">
                            {t('uploadExcel')}

                        </h3>
                        <div className="w-full">
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-indigo-500 file:to-purple-600 file:text-white hover:file:bg-gradient-to-r hover:file:from-purple-500 hover:file:to-indigo-600 transition duration-300 ease-in-out"
                            />
                        </div>
                        <button
                            type="button"
                            disabled={isUploading} // Disable button during upload
                            className={`w-full flex justify-center items-center py-3 px-5 text-white font-bold text-lg rounded-lg transition-all duration-300 ${
                                isUploading
                                    ? 'bg-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-500 hover:to-indigo-600'
                            } shadow-lg transform hover:scale-105 focus:outline-none`}
                        >
                            {isUploading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                            {t('uploading')}
                                </>
                            ) : (
                                <>
                                    {t('uploadFile')}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            </div>
        </div>
    );
};

export default AddUserPage;
