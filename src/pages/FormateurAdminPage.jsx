import React, { useState, useEffect } from 'react';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getUser } from '../helper/auth';
import Select from 'react-select'; // Custom select component for better styling
import { Button, Tooltip } from '@mui/material';
import { Email as EmailIcon, Phone as PhoneIcon, Person as PersonIcon, Business as BusinessIcon, Work as WorkIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const InstructorCard = ({ instructor }) => {
    const { t } = useTranslation('pages/formateurs');
    const [loadedImageUrl, setLoadedImageUrl] = useState(null);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const fetchImageWithAuth = async () => {
            try {
                const response = await axiosInstance.get(`http://localhost:8087/api${instructor.profileImagePath}`, {
                    responseType: 'blob'
                });
                const imageUrl = URL.createObjectURL(response.data);
                setLoadedImageUrl(imageUrl);
            } catch (error) {
                console.error("Error fetching image:", error);
                setLoadedImageUrl("https://via.placeholder.com/150");
            }
        };

        if (instructor.profileImagePath) {
            fetchImageWithAuth();
        } else {
            setLoadedImageUrl("https://via.placeholder.com/150");
        }
    }, [instructor.profileImagePath]);

    return (
        <motion.div
            className="shadow-lg rounded-lg bg-white p-6 mb-4 transform transition-transform duration-300 hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center mb-4">
                <img
                    src={loadedImageUrl || `https://i.pravatar.cc/150?u=${instructor.id}`}
                    alt={instructor.firstName}
                    className="w-16 h-16 rounded-full mr-4"
                />
                <div className="flex-1">
                    <h2 className="text-2xl font-semibold">{instructor.firstName} {instructor.lastName}</h2>
                    <p className="text-gray-600 mb-2"><strong>{t('labels.type')}:</strong> {instructor.typeFormateur === 'INTERNE' ? t('labels.internal') : t('labels.external')}</p>
                </div>
            </div>
            <div className="mb-4">
                <div className="flex items-center mb-2">
                    <Tooltip title={t('tooltips.email')}>
                        <EmailIcon className="text-blue-500 mr-2" />
                    </Tooltip>
                    <p className="text-gray-600 truncate">{instructor.email}</p>
                </div>
                <div className="flex items-center mb-2">
                    <Tooltip title={t('tooltips.phone')}>
                        <PhoneIcon className="text-green-500 mr-2" />
                    </Tooltip>
                    <p className="text-gray-600 truncate">{instructor.num}</p>
                </div>
                <div className="flex items-center mb-2">
                    <Tooltip title={t('tooltips.gender')}>
                        <PersonIcon className="text-purple-500 mr-2" />
                    </Tooltip>
                    <p className="text-gray-600 truncate">{instructor.gender}</p>
                </div>
                <div className="flex items-center mb-2">
                    <Tooltip title={t('tooltips.cin')}>
                        <WorkIcon className="text-red-500 mr-2" />
                    </Tooltip>
                    <p className="text-gray-600 truncate">{instructor.CIN}</p>
                </div>
                <div className="flex items-center mb-2">
                    <Tooltip title={t('tooltips.age')}>
                        <PersonIcon className="text-yellow-500 mr-2" />
                    </Tooltip>
                    <p className="text-gray-600 truncate">{instructor.age}</p>
                </div>
            </div>

            {(instructor.cabinetName || instructor.cabinetNum) && (
                <div>
                    {showMore && (
                        <div className="mt-4">
                            {instructor.cabinetName && (
                                <div className="flex items-center mb-2">
                                    <BusinessIcon className="text-gray-500 mr-2" />
                                    <p className="text-gray-600">{instructor.cabinetName}</p>
                                </div>
                            )}
                            {instructor.cabinetNum && (
                                <div className="flex items-center mb-2">
                                    <WorkIcon className="text-gray-500 mr-2" />
                                    <p className="text-gray-600">{instructor.cabinetNum}</p>
                                </div>
                            )}
                        </div>
                    )}
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setShowMore(prev => !prev)}
                        className="mt-4 w-full"
                    >
                        {showMore ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        <span className="ml-2">{showMore ? t('buttons.showLess') : t('buttons.showMore')}</span>
                    </Button>
                </div>
            )}
        </motion.div>
    );
};

// src/pages/InstructorsPage.js

const FormateursAdminPage = () => {
    const { t } = useTranslation('pages/formateurs');
    const [instructors, setInstructors] = useState([]);
    const [filteredInstructors, setFilteredInstructors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({ typeFormateur: '' });
    const [options, setOptions] = useState({ typeFormateurs: [
            { value: 'INTERNE', label: t('labels.internal') },
            { value: 'EXTERNE', label: t('labels.external') }
    ] });
    const { entrepriseId } = useParams();

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await axiosInstance.get(`/entreprises/${entrepriseId}/formateurs`);
                setInstructors(response.data);
                setFilteredInstructors(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching instructors:", error);
                toast.error(t('messages.loadError'));
                setIsLoading(false);
            }
        };

        fetchInstructors();
    }, [entrepriseId, t]);

    const handleFilterChange = (option) => {
        const value = option?.value || '';
        setFilters(prevFilters => {
            const newFilters = { ...prevFilters, typeFormateur: value };
            filterInstructors(newFilters);
            return newFilters;
        });
    };

    const filterInstructors = (filters) => {
        setFilteredInstructors(
            instructors.filter(instructor => 
                (!filters.typeFormateur || instructor.typeFormateur === filters.typeFormateur)
            )
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-center">{t('titles.instructors')}</h1>

            {/* Filter Bar */}
            <div className="flex justify-center mb-6">
                <Select
                    options={options.typeFormateurs}
                    onChange={handleFilterChange}
                    placeholder={t('placeholders.selectType')}
                    className="w-60"
                />
            </div>

            {isLoading ? (
                <div className="text-center">{t('messages.loading')}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInstructors.map(instructor => (
                        <InstructorCard key={instructor.id} instructor={instructor} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FormateursAdminPage;
