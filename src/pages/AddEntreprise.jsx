import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../helper/axios'; // Ensure you have an axios helper file
import { toast, ToastContainer } from 'react-toastify';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library for temporary IDs
import 'react-toastify/dist/ReactToastify.css'; // Import for toast notifications
import { FaPlus, FaTrash } from 'react-icons/fa'; // Import icons for better UI
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box } from '@chakra-ui/react'; // Import Chakra UI for accordions
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
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#e2e8f0',
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#1a202c',
    }),
    menu: (provided) => ({
        ...provided,
        zIndex: 9999,
    }),
};

const AddEntreprisePage = () => {
    const navigate = useNavigate();
    const [entreprise, setEntreprise] = useState({
        nomCommercial: '',
        numeroRC: '',
        numeroCNSS: '',
        numeroIF: '',
        numeroTP: '',
        nombreSalaries: '',
        hierarchicalUnitIds: [],
    });
    const [errors, setErrors] = useState({});
    const [logo, setLogo] = useState({});
    const [hierarchicalUnitIds, setHierarchicalUnitIds] = useState([]);
    // const [responsables, setResponsables] = useState([]);
    // const [selectedResponsables, setSelectedResponsables] = useState([]);


    const { t } = useTranslation('auth/addResponsable/addEntreprise'); // Initialize the translation function
    const isRTL = i18next.language === 'ar';
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEntreprise(prevState => ({ ...prevState, [name]: value }));
    };

    const handleHierarchicalUnitChange = (index, field, value) => {
        setEntreprise(prevState => {
            const updatedUnits = [...prevState.hierarchicalUnitIds];
            updatedUnits[index] = { ...updatedUnits[index], [field]: value };
            return { ...prevState, hierarchicalUnitIds: updatedUnits };
        });
    };

    const handleAddHierarchicalUnit = () => {
        setEntreprise(prevState => ({
            ...prevState,
            hierarchicalUnitIds: [
                ...prevState.hierarchicalUnitIds,
                { id: uuidv4(), name: '', type: '', parentId: null }, // Use UUID as temporary ID
            ],
        }));
    };

    const handleRemoveHierarchicalUnit = (index) => {
        setEntreprise(prevState => {
            const updatedUnits = [...prevState.hierarchicalUnitIds];
            updatedUnits.splice(index, 1);
            return { ...prevState, hierarchicalUnitIds: updatedUnits };
        });
    };

const handleParentChange = (index, selectedOption) => {
    setEntreprise(prevState => {
        const updatedUnits = [...prevState.hierarchicalUnitIds];
        const unitToUpdate = updatedUnits[index];

        // Prevent the unit from being its own parent
        if (selectedOption && selectedOption.value === unitToUpdate.id) {
            toast.error("A unit cannot be its own parent.");
            return prevState;
        }

        // Prevent the unit from having a parent with the same type
        const parentUnit = updatedUnits.find(u => u.id === selectedOption?.value);
        if (parentUnit && parentUnit.type === unitToUpdate.type) {
            toast.error("A unit cannot have a parent of the same type.");
            return prevState;
        }

        // Update parent ID if validation passes
        unitToUpdate.parentId = selectedOption ? selectedOption.value : null;
        updatedUnits[index] = unitToUpdate;

        return { ...prevState, hierarchicalUnitIds: updatedUnits };
    });
};

// useEffect(() => {
//     // Fetch responsables from the backend
//     const fetchResponsables = async () => {
//         try {
//             const response = await axiosInstance.get('/responsables'); // Adjust the endpoint as needed
//             const responsablesOptions = response.data.map(responsable => ({
//                 value: responsable.id,
//                 label: responsable.firstName + " " + responsable.lastName , // Adjust according to the structure of your responsables
//             }));
//             setResponsables(responsablesOptions);
//         } catch (error) {
//             console.error("Error fetching responsables:", error);
//             toast.error("Failed to load responsables");
//         }
//     };

//     fetchResponsables();
// }, []);


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
            if (e.target.files[0].size > 2 * 1024 * 1024) { // Check if file size exceeds 2MB
                setErrors(prevErrors => ({ ...prevErrors, image: 'Image size should not exceed 2MB.' }));
                setLogo(null);
                e.target.value = null; // Reset file input
                return;

            }
            else{
                setLogo(e.target.files[0]);
                setErrors(prevErrors => ({ ...prevErrors, image: null }));
            }
    };

   const submitHierarchicalUnits = async () => {
    try {
        // Step 1: Save Parent Units
        const parentUnits = entreprise.hierarchicalUnitIds.filter(unit => !unit.parentId);
        const parentResponses = await Promise.all(parentUnits.map(unit => {
            return axiosInstance.post('/hierarchical-units', unit);
        }));

        // Extract parent IDs and update state
        const parentIds = parentResponses.map(response => response.data.id);
        const parentIdMap = parentUnits.reduce((map, unit, index) => {
            map[unit.name] = parentIds[index]; // Use a unique identifier like `name` to map IDs
            return map;
        }, {});

        // Step 2: Update Units with Real Parent IDs
        const updatedUnits = entreprise.hierarchicalUnitIds.map(unit => {
            if (unit.parentId) {
                return { ...unit, parent: parentIdMap[unit.parentName] || null };
            }
            return unit;
        });
        setHierarchicalUnitIds(parentIds); // Save parent IDs

        // Step 3: Save Child Units with Updated Parent IDs
        const childUnits = updatedUnits.filter(unit => unit.parentId);
       const respnse = await Promise.all(childUnits.map(unit => {
            return axiosInstance.post('/hierarchical-units', unit);
        }));
        return respnse;
    } catch (error) {
        console.log("Error submitting hierarchical units:", error.response?.data || error.message);
        toast.error("Failed to submit hierarchical units");
        throw error; // Rethrow to handle in handleSubmit
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
        const response = await submitHierarchicalUnits();
        const unitsIds = entreprise.hierarchicalUnitIds.map(unit => unit.id);

        const entrepriseData = { 
            ...entreprise, 
            hierarchicalUnitIds: unitsIds,
            // responsableFormationIds: selectedResponsables.map(responsable => responsable.value) // Add responsables IDs to entreprise data
        };

        const formData = new FormData();
        formData.append('entreprise', new Blob([JSON.stringify({
            ...entrepriseData,
        })], { type: 'application/json' }));
        if (logo) formData.append('logo', logo);

        await axiosInstance.post('/entreprises', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        toast.success(t('addEntreprise.fields.success'));
        navigate('/admin/entreprises');
    } catch (error) {
        console.error("Error adding entreprise:", error.response?.data || error.message);
        toast.error(t('addEntreprise.fields.error'));
    }
};

    return (
        <div
        dir={isRTL ? 'rtl' : 'ltr'} 
        className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-6">{t('addEntreprise.title')}</h1>
            <form onSubmit={handleSubmit}>
                {/* Logo */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="logo">{t('addEntreprise.fields.logo')}</label>
                    <input type="file" id="logo" name="logo" onChange={handleLogoChange} />
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                </div>

                {/* Nom Commercial */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="nomCommercial">{t('addEntreprise.fields.commercialName')}</label>
                    <input
                        type="text"
                        name="nomCommercial"
                        value={entreprise.nomCommercial}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {errors.nomCommercial && <p className="text-red-500 text-sm mt-1">{errors.nomCommercial}</p>}
                </div>

                {/* RC Number */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="numeroRC">{t('addEntreprise.fields.rcNumber')}</label>
                    <input
                        type="text"
                        name="numeroRC"
                        value={entreprise.numeroRC}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                />
                {errors.numeroRC && <p className="text-red-500 text-sm mt-1">{errors.numeroRC}</p>}
            </div>

            {/* CNSS Number */}
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="numeroCNSS">{t('addEntreprise.fields.cnssNumber')}</label>
                <input
                    type="text"
                    name="numeroCNSS"
                    value={entreprise.numeroCNSS}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                />
                {errors.numeroCNSS && <p className="text-red-500 text-sm mt-1">{errors.numeroCNSS}</p>}
            </div>

            {/* IF Number */}
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="numeroIF">{t('addEntreprise.fields.ifNumber')}</label>
                <input
                    type="text"
                    name="numeroIF"
                    value={entreprise.numeroIF}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                />
                {errors.numeroIF && <p className="text-red-500 text-sm mt-1">{errors.numeroIF}</p>}
            </div>

            {/* TP Number */}
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="numeroTP">{t('addEntreprise.fields.tpNumber')}</label>
                <input
                    type="text"
                    name="numeroTP"
                    value={entreprise.numeroTP}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                />
                {errors.numeroTP && <p className="text-red-500 text-sm mt-1">{errors.numeroTP}</p>}
            </div>

            {/* Number of Employees */}
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="nombreSalaries">{t('addEntreprise.fields.numberOfEmployees')}</label>
                <input
                    type="number"
                    name="nombreSalaries"
                    value={entreprise.nombreSalaries}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                />
                {errors.nombreSalaries && <p className="text-red-500 text-sm mt-1">{errors.nombreSalaries}</p>}
            </div>
            {/* <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="responsables">
                    {t('addEntreprise.fields.responsables')}
                </label>
                <Select
                    id="responsables"
                    isMulti
                    name="responsables"
                    options={responsables}
                    value={selectedResponsables}
                    onChange={setSelectedResponsables}
                    styles={customStyles}
                    placeholder={t('addEntreprise.fields.selectResponsables')}
                />
            </div> */}
                {/* Hierarchical Units */}
                <div className="mb-4">
                  

                    <Accordion allowMultiple>
                        {entreprise.hierarchicalUnitIds.map((unit, index) => (
                            <AccordionItem key={index}>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" className='my-3'>
                                        {unit.name || `Unit ${index + 1}`}
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-1">{t('addEntreprise.fields.addUnit')}</label>
                                            <input
                                                type="text"
                                                value={unit.name}
                                               onChange={(e) => handleHierarchicalUnitChange(index, 'name', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-1">{t('addEntreprise.fields.unitType')}</label>
                                            <input
                                                type="text"
                                                value={unit.type}
                                                onChange={(e) => handleHierarchicalUnitChange(index, 'type', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </div>
                                        <div classname="col-span-2">
                                            <label classname="block text-sm font-bold mb-1">{t('addEntreprise.fields.parentUnit')}</label>
                                            <Select
                                                options={[
                                                    { value: null, label: t('addEntreprise.fields.noParent')}, // default option for no parent
                                                    ...entreprise.hierarchicalUnitIds
                                                        .filter((u) => u.id !== unit.id) // exclude the current unit itself from the options
                                                        .map((u) => ({
                                                            value: u.id,
                                                            label: u.name,
                                                        })),
                                                ]}
                                                onChange={(selectedOption) => handleParentChange(index, selectedOption)}
                                                value={unit.parentId
                                                    ? { value: unit.parentId, label: entreprise.hierarchicalUnitIds.find((u) => u.id === unit.parentId)?.name }
                                                    : { value: null, label:t('addEntreprise.fields.noParent') }
                                                }
                                                placeholder= {t('addEntreprise.fields.selectParentLeaveEmpty')}
                                                styles={customStyles}
                                                menuPortalTarget={document.body} // This ensures the menu renders outside the regular flow
                                                menuPosition="absolute" // Makes sure the dropdown isn't cut off by container boundaries
                                                menuShouldScrollIntoView={false} // Ensures the menu remains visible even if scrollable
                                            />
                                            <p className="text-gray-500 text-sm mt-1">
                                            {t('addEntreprise.fields.parentUnitInfo')}
                                            </p>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => handleRemoveHierarchicalUnit(index)} className="mt-4 text-red-500 flex items-center">
                                        <FaTrash className="mr-2" /> {t('addEntreprise.fields.removeUnit')}
                                    </button>
                                </AccordionPanel>
                            </AccordionItem>
                        ))}
                    </Accordion>
                    <button type="button" onClick={handleAddHierarchicalUnit} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
                        <FaPlus className="mr-2" /> {t('addEntreprise.fields.addUnit')}
                    </button>
                </div>
            <div className="flex justify-end">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{t('addEntreprise.fields.submit')}</button>
            </div>
        </form>
    </div>

)};

export default AddEntreprisePage;