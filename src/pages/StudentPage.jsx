import React, { useState, useEffect } from 'react';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Button } from '@mui/material';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaGenderless, FaIdCard, FaBuilding, FaMapMarkerAlt, FaCompass, FaBriefcase } from 'react-icons/fa';
import { getUser } from '../helper/auth';
import { useTranslation } from 'react-i18next'; // import the hook

const StudentCard = ({ student }) => {
    const { t, i18n } = useTranslation('pages/studentsPage'); // Initialize translation hook
    const [loadedImageUrl, setLoadedImageUrl] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchImageWithAuth = async () => {
            try {
                const response = await axiosInstance.get(`${student.imagePath}`, {
                    responseType: 'blob'
                });
                const imageUrl = URL.createObjectURL(response.data);
                setLoadedImageUrl(imageUrl);
            } catch (error) {
                console.error("Error fetching image:", error);
                setLoadedImageUrl("https://via.placeholder.com/150");
            }
        };

        if (student.imagePath) {
            fetchImageWithAuth();
        } else {
            setLoadedImageUrl("https://via.placeholder.com/150");
        }
    }, [student.imagePath]);

    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <motion.div
            className={`shadow-lg rounded-lg bg-white p-6 mb-6 transform transition-transform duration-300 hover:scale-105 overflow-hidden ${i18n.language === 'ar' ? 'text-right' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center mb-4">
                <img
                    src={loadedImageUrl || `https://i.pravatar.cc/150?u=${student.id}`}
                    alt={student.firstName}
                    className="w-24 h-24 rounded-full border-2 border-gray-300 mr-4"
                />
                <div>
                    <h2 className="text-lg md:text-xl font-bold mb-1">{student.firstName} {student.lastName}</h2>
                </div>
            </div>

            <div className={`overflow-hidden transition-max-height duration-300 ease-in-out ${isExpanded ? 'max-h-96' : 'max-h-24'}`}>
                <div className="mb-2 text-gray-600">
                    {student.num && (
                        <div className="flex items-center mb-2">
                            <FaPhone className="text-blue-500 mr-2" />
                            <p className="truncate">{student.num}</p>
                        </div>
                    )}
                    {student.email && (
                        <div className="flex items-center mb-2">
                            <FaEnvelope className="text-blue-500 mr-2" />
                            <p className="truncate">{student.email}</p>
                        </div>
                    )}
                    {student.gender && (
                        <div className="flex items-center mb-2">
                            <FaGenderless className="text-blue-500 mr-2" />
                            <p className="truncate">{t(`gender.${student.gender}`)}</p>
                        </div>
                    )}
                    {student.cin && (
                        <div className="flex items-center mb-2">
                            <FaIdCard className="text-blue-500 mr-2" />
                            <p className="truncate">{student.cin}</p>
                        </div>
                    )}
                    {student.age && (
                        <div className="flex items-center mb-2">
                            <p className="truncate">{student.age} {t('yearsOld')}</p>
                        </div>
                    )}
                    {isExpanded && (
                        <>
                            {student.filiale && (
                                <div className="flex items-center mb-2">
                                    <FaBuilding className="text-blue-500 mr-2" />
                                    <p className="truncate">{student.filiale}</p>
                                </div>
                            )}
                            {student.pole && (
                                <div className="flex items-center mb-2">
                                    <FaMapMarkerAlt className="text-blue-500 mr-2" />
                                    <p className="truncate">{student.pole}</p>
                                </div>
                            )}
                            {student.direction && (
                                <div className="flex items-center mb-2">
                                    <FaCompass className="text-blue-500 mr-2" />
                                    <p className="truncate">{student.direction}</p>
                                </div>
                            )}
                            {student.departement && (
                                <div className="flex items-center mb-2">
                                    <FaBriefcase className="text-blue-500 mr-2" />
                                    <p className="truncate">{student.departement}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            
            <button 
                className="text-blue-500 mt-4"
                onClick={handleToggleExpand}
            >
                {isExpanded ? t('showLess') : t('showMore')}
            </button>
        </motion.div>
    );
};

const StudentsPage = ({ path }) => {
    const { t, i18n } = useTranslation('pages/studentsPage'); // Initialize translation hook
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [options, setOptions] = useState([]); // Hierarchical units
    const [filterChain, setFilterChain] = useState([null]); // Dynamic filters
    const id = getUser().userId;

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axiosInstance.get(`${path}/${id}/participants`);
                setStudents(response.data);
                setFilteredStudents(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching students:", error);
                toast.error(t('loadFailed'));
                setIsLoading(false);
            }
        };

        const fetchEnterpriseData = async () => {
            try {
                const response = await axiosInstance.get(`${path}/${id}/hierarchical-units`);
                const hierarchicalUnits = response.data.map(unit => ({
                    value: unit.id,
                    label: unit.name,
                    type: unit.type,
                    parentId: unit.parentId
                }));
                setOptions(hierarchicalUnits); // Store fetched units as filter options
            } catch (error) {
                console.error("Error fetching hierarchical units:", error);
            }
        };

        fetchStudents();
        fetchEnterpriseData();
    }, [id]);

    const handleFilterChange = (selectedUnit, index) => {
        const updatedChain = [...filterChain];
        updatedChain[index] = selectedUnit;
        setFilterChain(updatedChain);

        const childUnits = options.filter(unit => unit.parentId === selectedUnit?.value);
        if (childUnits.length > 0) {
            updatedChain[index + 1] = null;
        } else {
            updatedChain.splice(index + 1);
        }

        setFilterChain(updatedChain);
        filterStudents(updatedChain);
    };

const filterStudents = (filterChain) => {
    const selectedUnitIds = filterChain.filter(unit => unit !== null).map(unit => unit.value);

    if (selectedUnitIds.length > 0) {
        let filtered = students;

        selectedUnitIds.forEach(unitId => {
            const allDescendants = getAllDescendants(unitId, options);  // Ensure this function correctly fetches descendants
            filtered = filtered.filter(student => {
                // Make sure student.hierarchicalUnitId matches unitId or its descendants
                return [unitId, ...allDescendants].includes(student.hierarchicalUnitId);
            });
        });

        setFilteredStudents(filtered);
    } else {
        setFilteredStudents(students); // Reset when no filters
    }
};

const getAllDescendants = (unitId, units) => {
    let descendants = [];
    const directChildren = units.filter(unit => unit.parentId === unitId);

    directChildren.forEach(child => {
        descendants.push(child.value);
        descendants = descendants.concat(getAllDescendants(child.value, units)); // Recursively get descendants
    });

    return descendants;
};


    const switchLanguage = (lang) => {
        i18n.changeLanguage(lang);
        if (lang === 'ar') {
            document.body.setAttribute('dir', 'rtl');
        } else {
            document.body.removeAttribute('dir');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-center">{t('participants')}</h1>

            <div className="flex flex-wrap mb-6 justify-center">
                {filterChain.map((filter, index) => (
                    <div key={index} className="mb-4 mx-2 w-full md:w-1/3">
                        <Select
                            value={filter}
                            onChange={(selected) => handleFilterChange(selected, index)}
                            options={options.filter(unit => unit.parentId === (filterChain[index - 1]?.value || null))}
                            placeholder={t('selectUnit')}
                        />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                        <StudentCard key={student.id} student={student} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-3">{t('noStudents')}</p>
                )}
            </div>
        </div>
    );
};

export default StudentsPage;
