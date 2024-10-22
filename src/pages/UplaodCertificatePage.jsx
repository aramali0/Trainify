import React, { useEffect, useState } from 'react';
import axiosInstanceForRessources from '../helper/axiosForResoures';
import { toast, ToastContainer } from 'react-toastify';
import Select from 'react-select';
import { getUser } from '../helper/auth';
import { useTranslation } from 'react-i18next';

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

const UploadCertificatePage = ({ path, nom }) => {
    const { t, i18n } = useTranslation('pages/uploadCertificate');
    const [participants, setParticipants] = useState([]);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [file, setFile] = useState(null);
    const [loadingParticipants, setLoadingParticipants] = useState(true);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const responsableId = getUser().userId;
                const response = await axiosInstanceForRessources.get(`${path}/${responsableId}/participants`);
                setParticipants(response.data.map(p => ({ value: p.id, label: `${p.firstName} ${p.lastName}` })));
            } catch (error) {
                toast.error(t('fetchError'));
            } finally {
                setLoadingParticipants(false);
            }
        };

        fetchParticipants();
    }, [path, t]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSelectChange = (selectedOption) => {
        setSelectedParticipant(selectedOption ? selectedOption.value : null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file || !selectedParticipant) {
            toast.error(t('selectError'));
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('participantId', selectedParticipant);

        try {
            await axiosInstanceForRessources.post('/certificates/upload', formData);
            toast.success(t('uploadSuccess'));
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error(t('uploadError'));
        }
    };

    // Determine if RTL layout is required for Arabic
    const isRTL = i18n.language === 'ar';

    return (
        <div className={`min-h-screen flex items-center justify-center bg-gray-100 ${isRTL ? 'rtl' : ''}`}>
            <ToastContainer />
            <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">{t('title')}</h1>
                <form onSubmit={handleSubmit}>
                    {/* Participant Selection */}
                    <div className="mb-6">
                        <label htmlFor="participant" className="block text-lg font-medium text-gray-700 mb-2">
                            {t('selectParticipant')}
                        </label>
                        {loadingParticipants ? (
                            <p>{t('loadingParticipants')}</p>
                        ) : (
                            <Select
                                name="participant"
                                value={participants.find(p => p.value === selectedParticipant)}
                                onChange={handleSelectChange}
                                options={participants}
                                styles={customStyles}
                                classNamePrefix="select"
                                placeholder={t('selectPlaceholder')}
                            />
                        )}
                    </div>

                    {/* File Upload */}
                    <div className="mb-6">
                        <label htmlFor="file" className="block text-lg font-medium text-gray-700 mb-2">
                            {t('uploadFile')}
                        </label>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white text-lg font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-300"
                    >
                        {t('upload')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadCertificatePage;
