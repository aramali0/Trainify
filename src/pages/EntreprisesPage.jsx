import React, { useState, useEffect } from 'react';
import axiosInstance from '../helper/axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import EntrepriseCard from '../components/EntrepriseCard';
import { useTranslation } from 'react-i18next';

const EntreprisesPage = () => {
    const { t } = useTranslation('pages/entreprises'); // Initialize translation hook
    const [entreprises, setEntreprises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEntreprises = async () => {
            try {
                const response = await axiosInstance.get('/entreprises');
                setEntreprises(response.data);
            } catch (error) {
                console.error("Error fetching entreprises:", error);
                toast.error(t("errors.loadEnterprises")); // Use translation for error message
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntreprises();
    }, [t]);

    const handleCreateEntreprise = () => navigate('/admin/entreprises/add');

    // Check if the current language is Arabic for RTL support
    const isArabic = localStorage.getItem('i18nextLng') === 'ar';

    return (
        <div className={`max-w-7xl mx-auto p-6 bg-gray-100 ${isArabic ? 'text-right' : 'text-left'}`}>
            <ToastContainer />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{t("title")}</h1>
                <button
                    onClick={handleCreateEntreprise}
                    className="px-2 py-1 md:px-4 md:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
                >
                    {t("createEntrepriseButton")}
                </button>
            </div>

            {isLoading ? (
                <div className="text-center text-lg font-medium">{t("loading")}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {entreprises.map(entreprise => (
                        <EntrepriseCard key={entreprise.id} entreprise={entreprise} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EntreprisesPage;
