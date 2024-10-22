import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../helper/axios';
import { toast, ToastContainer } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library for temporary IDs
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus, FaTrash } from 'react-icons/fa';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

const customStyles = {
    container: (provided) => ({
        ...provided,
        width: '100%',
    }),
    control: (provided) => ({
        ...provided,
        borderColor: '#e2e8f0',
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#cbd5e0',
        },
    }),
    menu: (provided) => ({
        ...provided,
        zIndex: 9999,
        maxHeight: '300px',
        overflowY: 'auto',
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#e2e8f0',
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#1a202c',
    }),
};

const UpdateEntreprisePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [entreprise, setEntreprise] = useState({
        nomCommercial: '',
        numeroRC: '',
        numeroCNSS: '',
        numeroIF: '',
        numeroTP: '',
        nombreSalaries: '',
        hierarchicalUnitIds: [], // This will hold only the IDs
    });
    const [errors, setErrors] = useState({});
    const [logo, setLogo] = useState(null);
    const [hierarchicalUnits, setHierarchicalUnits] = useState([]); // Existing units fetched from backend
    const [newHierarchicalUnits, setNewHierarchicalUnits] = useState([]); // Units to be created
    const [unitOptions, setUnitOptions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { t } = useTranslation('auth/addResponsable/addEntreprise'); // Initialize the translation function
    const isRTL = i18next.language === 'ar';

    useEffect(() => {
        const fetchEntreprise = async () => {
            try {
                const { data } = await axiosInstance.get(`/entreprises/${id}`);
                setEntreprise({
                    id:data.id,
                    nomCommercial: data.nomCommercial,
                    numeroRC: data.numeroRC,
                    numeroCNSS: data.numeroCNSS,
                    numeroIF: data.numeroIF,
                    numeroTP: data.numeroTP,
                    nombreSalaries: data.nombreSalaries,
                    hierarchicalUnitIds: data.hierarchicalUnitIds, // Existing unit IDs
                });
                fetchHierarchicalUnits();
            } catch (error) {
                toast.error('Failed to load entreprise data');
            }
        };
        fetchEntreprise();
    }, [id]);

    const fetchHierarchicalUnits = async () => {
        try {
            const { data } = await axiosInstance.get(`/hierarchical-units/entreprise/${id}`);
            setHierarchicalUnits(data);
            setUnitOptions(
                data.map((unit) => ({
                    value: unit.id,
                    label: unit.name,
                }))
            );
            console.log('Fetched hierarchical units:', data);
        } catch (error) {
            toast.error('Failed to load hierarchical units');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEntreprise((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleHierarchicalUnitChange = (index, field, value) => {
        setNewHierarchicalUnits((prevUnits) => {
            const updatedUnits = [...prevUnits];
            updatedUnits[index] = { ...updatedUnits[index], [field]: value };
            return updatedUnits;
        });
    };

const handleAddHierarchicalUnit = () => {
    const tempId = uuidv4(); // Generate a temporary ID
    setNewHierarchicalUnits((prevUnits) => [
        ...prevUnits,
        { tempId, name: '', type: '', parentId: null },
    ]);
};


    const handleRemoveHierarchicalUnit = (index) => {
        setNewHierarchicalUnits((prevUnits) => {
            const updatedUnits = [...prevUnits];
            updatedUnits.splice(index, 1);
            return updatedUnits;
        });
    };

const handleParentChange = (index, selectedOption) => {
    setNewHierarchicalUnits((prevUnits) => {
        const updatedUnits = [...prevUnits];
        const unitToUpdate = updatedUnits[index];

        // Prevent the unit from being its own parent
        if (selectedOption && selectedOption.value === unitToUpdate.tempId) {
            toast.error('A unit cannot be its own parent.');
            return prevUnits;
        }

        // Prevent the unit from having a parent with the same type
        const parentUnit =
            hierarchicalUnits.find((u) => u.id === selectedOption?.value) ||
            newHierarchicalUnits.find((u) => u.tempId === selectedOption?.value);
        if (parentUnit && parentUnit.type === unitToUpdate.type) {
            toast.error('A unit cannot have a parent of the same type.');
            return prevUnits;
        }

        updatedUnits[index].parentId = selectedOption ? selectedOption.value : null;
        return updatedUnits;
    });
};


    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        // Regular expressions
        const numberRegex = /^[0-9]+$/; // Only numbers
        const nameRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces

        // Validate Commercial Name
        if (!entreprise.nomCommercial.trim()) {
            newErrors.nomCommercial = t('addEntreprise.validation.commercialNameRequired');
            isValid = false;
        } else if (!nameRegex.test(entreprise.nomCommercial)) {
            newErrors.nomCommercial = t('addEntreprise.validation.lettersOnly');
            isValid = false;
        }

        // Validate RC Number
        if (!entreprise.numeroRC.trim()) {
            newErrors.numeroRC = t('addEntreprise.validation.rcNumberRequired');
            isValid = false;
        } else if (!numberRegex.test(entreprise.numeroRC)) {
            newErrors.numeroRC = t('addEntreprise.validation.numbersOnly');
            isValid = false;
        }

        // Validate CNSS Number
        if (!entreprise.numeroCNSS.trim()) {
            newErrors.numeroCNSS = t('addEntreprise.validation.cnssNumberRequired'); 
            isValid = false;
        } else if (!numberRegex.test(entreprise.numeroCNSS)) {
            newErrors.numeroCNSS = t('addEntreprise.validation.numbersOnly');
            isValid = false;
        }

        // Validate IF Number
        if (!entreprise.numeroIF.trim()) {
            newErrors.numeroIF = t('addEntreprise.validation.ifNumberRequired');
            isValid = false;
        } else if (!numberRegex.test(entreprise.numeroIF)) {
            newErrors.numeroIF = t('addEntreprise.validation.numbersOnly');
            isValid = false;
        }

        // Validate TP Number
        if (!entreprise.numeroTP.trim()) {
            newErrors.numeroTP = t('addEntreprise.validation.tpNumberRequired');
            isValid = false;
        } else if (!numberRegex.test(entreprise.numeroTP)) {
            newErrors.numeroTP = t('addEntreprise.validation.numbersOnly');
            isValid = false;
        }

        // Validate Number of Employees
        if (!entreprise.nombreSalaries) {
            newErrors.nombreSalaries = t('addEntreprise.validation.employeesRequired');
            isValid = false;
        } else if (!numberRegex.test(entreprise.nombreSalaries)) {
            newErrors.nombreSalaries = t('addEntreprise.validation.numbersOnly');
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };


    const handleLogoChange = (e) => {
        if (e.target.files[0].size > 2 * 1024 * 1024) {
            setErrors((prevErrors) => ({ ...prevErrors, image: 'Image size should not exceed 2MB.' }));
            setLogo(null);
            e.target.value = null;
            return;
        } else {
            setLogo(e.target.files[0]);
            setErrors((prevErrors) => ({ ...prevErrors, image: null }));
        }
    };

const submitHierarchicalUnits = async () => {
    try {
        // Mapping of tempId to realId
        const tempIdToRealIdMap = {};

        // Save all new hierarchical units sequentially
        for (const unit of newHierarchicalUnits) {
            const response = await axiosInstance.post('/hierarchical-units', {
                id: unit.tempId, // Use tempId as ID
                name: unit.name,
                type: unit.type,
                entrepriseId:id,
                parentId: unit.parentId
                    ? tempIdToRealIdMap[unit.parentId] || unit.parentId // Replace tempId with realId if necessary
                    : null,
            });

            // Map tempId to realId
            tempIdToRealIdMap[unit.tempId] = response.data.id;
        }

        // Return all new unit IDs
        return Object.values(tempIdToRealIdMap);
    } catch (error) {
        console.error("Failed to submit hierarchical units", error);
        toast.error("Failed to submit hierarchical units");
        throw error;
    }
};


const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true); // Start submitting

    try {
        // Step 1: Submit and save new hierarchical units, get their IDs
        const newUnitIds = await submitHierarchicalUnits();
        console.log("New Hierarchical Unit IDs:", newUnitIds);

        // Step 2: Combine existing unit IDs with new unit IDs
        const combinedHierarchicalUnitIds = [
            ...entreprise.hierarchicalUnitIds, // Existing units
            ...newUnitIds, // Newly added units
        ];

        // Step 3: Prepare the entreprise data with combined unit IDs
        const entrepriseData = {
            ...entreprise,
            hierarchicalUnitIds: combinedHierarchicalUnitIds,
        };

        const formData = new FormData();
        formData.append('entreprise', new Blob([JSON.stringify(entrepriseData)], { type: 'application/json' }));

        if (logo) formData.append('logo', logo);

        // Step 4: Update the entreprise with the associated hierarchical unit IDs
        console.log("Updated Entreprise Data:", entrepriseData);
        
        await axiosInstance.put(`/entreprises/${entreprise.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        toast.success("Entreprise updated successfully");
        navigate('/admin/entreprises');
    } catch (error) {
        console.error("Error updating entreprise:", error.response?.data || error.message);
        toast.error("Failed to update entreprise");
    } finally {
        setIsSubmitting(false); // End submitting
    }
};



    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md"
        >
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-4">{t('addEntreprise.title')}</h1>
            <form onSubmit={handleSubmit}>
                {/* Commercial Name */}
                <div className="mb-4">
                    <label htmlFor="nomCommercial" className="block text-sm font-bold mb-1">
                        {t('addEntreprise.fields.commercialName')}
                    </label>
                    <input
                        type="text"
                        id="nomCommercial"
                        name="nomCommercial"
                        value={entreprise.nomCommercial}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${
                            errors.nomCommercial ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.nomCommercial && (
                        <p className="text-red-500 text-xs">{errors.nomCommercial}</p>
                    )}
                </div>

                {/* RC Number */}
                <div className="mb-4">
                    <label htmlFor="numeroRC" className="block text-sm font-bold mb-1">
                        {t('addEntreprise.fields.rcNumber')}
                    </label>
                    <input
                        type="text"
                        id="numeroRC"
                        name="numeroRC"
                        value={entreprise.numeroRC}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${
                            errors.numeroRC ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.numeroRC && <p className="text-red-500 text-xs">{errors.numeroRC}</p>}
                </div>

                {/* CNSS Number */}
                <div className="mb-4">
                    <label htmlFor="numeroCNSS" className="block text-sm font-bold mb-1">
                        {t('addEntreprise.fields.cnssNumber')}
                    </label>
                    <input
                        type="text"
                        id="numeroCNSS"
                        name="numeroCNSS"
                        value={entreprise.numeroCNSS}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${
                            errors.numeroCNSS ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.numeroCNSS && (
                        <p className="text-red-500 text-xs">{errors.numeroCNSS}</p>
                    )}
                </div>

                {/* IF Number */}
                <div className="mb-4">
                    <label htmlFor="numeroIF" className="block text-sm font-bold mb-1">
                        {t('addEntreprise.fields.ifNumber')}
                    </label>
                    <input
                        type="text"
                        id="numeroIF"
                        name="numeroIF"
                        value={entreprise.numeroIF}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${
                            errors.numeroIF ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.numeroIF && <p className="text-red-500 text-xs">{errors.numeroIF}</p>}
                </div>

                {/* TP Number */}
                <div className="mb-4">
                    <label htmlFor="numeroTP" className="block text-sm font-bold mb-1">
                        {t('addEntreprise.fields.tpNumber')}
                    </label>
                    <input
                        type="text"
                        id="numeroTP"
                        name="numeroTP"
                        value={entreprise.numeroTP}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${
                            errors.numeroTP ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.numeroTP && <p className="text-red-500 text-xs">{errors.numeroTP}</p>}
                </div>

                {/* Number of Employees */}
                <div className="mb-4">
                    <label htmlFor="nombreSalaries" className="block text-sm font-bold mb-1">
                        {t('addEntreprise.fields.numberOfEmployees')}
                    </label>
                    <input
                        type="number"
                        id="nombreSalaries"
                        name="nombreSalaries"
                        value={entreprise.nombreSalaries}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${
                            errors.nombreSalaries ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.nombreSalaries && (
                        <p className="text-red-500 text-xs">{errors.nombreSalaries}</p>
                    )}
                </div>

                {/* Logo Upload */}
                <div className="mb-4">
                    <label htmlFor="logo" className="block text-sm font-bold mb-1">
                        {t('addEntreprise.fields.logo')}
                    </label>
                    <input
                        type="file"
                        id="logo"
                        onChange={handleLogoChange}
                        className={`w-full p-2 border rounded ${
                            errors.image ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}
                </div>

                {/* Hierarchical Units */}
                <Accordion allowToggle>
                    {/* Existing Hierarchical Units */}
                    {hierarchicalUnits.map((unit) => (
                        <AccordionItem key={unit.id}>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" className="text-lg text-gray-500 font-bold my-1">
                                        {unit.name}
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-1">
                        {t('addEntreprise.fields.unitName')}
</label>
                                    <input
                                        type="text"
                                        value={unit.name}
                                        onChange={(e) => {
                                            // Handle existing units' updates if needed
                                            // For simplicity, assuming hierarchical units are managed separately
                                        }}
                                        className="w-full p-2 border rounded"
                                        disabled
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-1">{t('addEntreprise.fields.unitType')}</label>
                                    <input
                                        type="text"
                                        value={unit.type}
                                        onChange={(e) => {
                                            // Handle existing units' updates if needed
                                        }}
                                        className="w-full p-2 border rounded"
                                        disabled
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-1">                        {t('addEntreprise.fields.parentUnit')}</label>
                                    <Select
                                        styles={customStyles}
                                        options={[
                                            { value: null, label: 'No parent (root unit)' },
                                            ...unitOptions.filter((option) => option.value !== unit.id),
                                        ]}
                                        value={
                                            unit.parentId
                                                ? unitOptions.find((option) => option.value === unit.parentId)
                                                : { value: null, label: 'No parent (root unit)' }
                                        }
                                        onChange={(selectedOption) => {
                                            // Handle parent change for existing units if needed
                                        }}
                                        placeholder="Select a parent unit"
                                        menuPortalTarget={document.body}
                                        menuPosition="absolute"
                                        menuShouldScrollIntoView={false}
                                        isDisabled
                                    />
                                </div>
                            </AccordionPanel>
                        </AccordionItem>
                    ))}

                    {/* New Hierarchical Units */}
                    {newHierarchicalUnits.map((unit, index) => (
                        <AccordionItem key={`new-unit-${index}`}>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" className="text-lg text-gray-500 font-bold my-1">
                                        {unit.name || `New Unit ${index + 1}`}
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                {/* Unit Name */}
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-1">{t('addEntreprise.fields.unitName')}</label>
                                    <input
                                        type="text"
                                        value={unit.name}
                                        onChange={(e) =>
                                            handleHierarchicalUnitChange(index, 'name', e.target.value)
                                        }
                                        className={`w-full p-2 border rounded ${
                                            errors[`unitName_${index}`] ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors[`unitName_${index}`] && (
                                        <p className="text-red-500 text-xs">{errors[`unitName_${index}`]}</p>
                                    )}
                                </div>

                                {/* Unit Type */}
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-1">{t('addEntreprise.fields.unitType')}</label>
                                    <input
                                        type="text"
                                        value={unit.type}
                                        onChange={(e) =>
                                            handleHierarchicalUnitChange(index, 'type', e.target.value)
                                        }
                                        className={`w-full p-2 border rounded ${
                                            errors[`unitType_${index}`] ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors[`unitType_${index}`] && (
                                        <p className="text-red-500 text-xs">{errors[`unitType_${index}`]}</p>
                                    )}
                                </div>

                                {/* Parent Unit */}
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-1">{t('addEntreprise.fields.parentUnit')}</label>
                                    <Select
                                        styles={customStyles}
                                        options={[
                                            { value: null, label: 'No parent (root unit)' },
                                            ...unitOptions,
                                        ]}
                                        value={
                                            unit.parentId
                                                ? unitOptions.find((option) => option.value === unit.parentId)
                                                : { value: null, label: 'No parent (root unit)' }
                                        }
                                        onChange={(selectedOption) =>
                                            handleParentChange(index, selectedOption)
                                        }
                                        placeholder="Select a parent unit"
                                        menuPortalTarget={document.body}
                                        menuPosition="absolute"
                                        menuShouldScrollIntoView={false}
                                    />
                                    <p className="text-gray-500 text-sm mt-1">
                                        {t('addEntreprise.fields.parentUnitInfo')}
                                    </p>
                                </div>

                                {/* Remove Button */}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveHierarchicalUnit(index)}
                                    className="mt-4 text-red-500 flex items-center"
                                >
                                    <FaTrash className="mr-2" />
                                        {t('addEntreprise.fields.removeUnit')}

                                </button>
                            </AccordionPanel>
                        </AccordionItem>
                    ))}

                    {/* Add Hierarchical Unit Button */}
                    <button
                        type="button"
                        onClick={handleAddHierarchicalUnit}
                        className="mt-4 flex items-center text-blue-500 hover:text-blue-700"
                    >
                        <FaPlus className="mr-1" /> 
                    </button>
                </Accordion>

                {/* Submit Button */}
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isSubmitting ? 'Updating...' :  t('addEntreprise.fields.submit')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateEntreprisePage;
