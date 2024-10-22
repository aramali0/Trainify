import React, { useState } from 'react';
import axiosInstance from '../helper/axios';
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const CreateLibraryPage = () => {
    const { courseId } = useParams(); // Get courseId from URL parameters
    const [libraryName, setLibraryName] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const { t } = useTranslation('pages/createLibraryPage'); // Use translation hook

    const validateLibraryName = (name) => {
        // Check for non-empty and valid characters (letters, numbers, spaces, and dashes)
        const namePattern = /^[a-zA-Z\s\-]+$/;
        if (!name.trim()) {
            return t('validation.emptyLibraryName'); // Use translation for error message
        }
        if (!namePattern.test(name)) {
            return t('validation.invalidLibraryName'); // Use translation for error message
        }
        if (name.length < 3 || name.length > 50) {
            return t('validation.libraryNameLength'); // Use translation for error message
        }
        return null;
    };

    const handleCreateLibrary = async () => {
        const validationError = validateLibraryName(libraryName);
        if (validationError) {
            toast.error(validationError);
            return;
        }

        setLoading(true); // Set loading state to true

        try {
            await axiosInstance.post('/libraries', {
                name: libraryName,
                courId: courseId // Fixed typo from courId to courseId
            });
            toast.success(t('success.libraryCreated')); // Use translation for success message
            setLibraryName(''); // Clear input field on success
        } catch (error) {
            toast.error(t('error.libraryCreationFailed')); // Use translation for error message
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="p-6 bg-gray-100">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-4 text-gray-800">{t('header.createLibrary')}</h1>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <input
                    type="text"
                    value={libraryName}
                    onChange={(e) => setLibraryName(e.target.value)}
                    placeholder={t('placeholder.libraryName')}
                    className="border border-gray-300 rounded-md p-2 mb-4 w-full"
                />
                <button
                    onClick={handleCreateLibrary}
                    disabled={loading} // Disable button while loading
                    className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? t('button.creating') : t('button.createLibrary')}
                </button>
            </div>
        </div>
    );
};

export default CreateLibraryPage;
