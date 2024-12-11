import React, { useEffect, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../helper/axios';
import {
  FaBuilding,
  FaUserTie,
  FaUsers,
  FaIdBadge,
  FaRegAddressCard,
} from 'react-icons/fa';
import Switch from 'react-switch'; // Optional: For better-looking switches
import { useTranslation } from 'react-i18next';

const EntrepriseCard = ({ entreprise }) => {
  const { t } = useTranslation('pages/entrepriseCard');
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState(null);
  const [localEntreprise, setLocalEntreprise] = useState(entreprise);
  const [loading, setLoading] = useState({
    showQuizResult: false,
    showQuizCorrection: false,
    showExcelMethode: false,
    showDownloadVideo: false,
  });

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        if (localEntreprise.logo) {
          const response = await axiosInstance.get(
            `${localEntreprise.logo}`,
            { responseType: 'blob' }
          );
          setLogoUrl(URL.createObjectURL(response.data));
        } else {
          setLogoUrl('https://via.placeholder.com/150'); // Placeholder image if no logo is provided
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
        setLogoUrl('https://via.placeholder.com/150'); // Fallback image on error
      }
    };

    fetchLogo();
  }, [localEntreprise.logo]);

  const handleUpdate = () => {
    navigate(`/admin/entreprises/update/${localEntreprise.id}`);
  };

  // Generic handler for toggling boolean attributes
  const handleToggle = async (attribute) => {
    const currentValue = localEntreprise[attribute];
    // Set loading state for the specific attribute
    setLoading((prev) => ({ ...prev, [attribute]: true }));

    try {
      // Construct the endpoint based on the attribute
      let endpoint = '';
      switch (attribute) {
        case 'showQuizResult':
          endpoint = `/show-quiz-result`;
          break;
        case 'showQuizCorrection':
          endpoint = `/show-quiz-correction`;
          break;
        case 'showExcelMethode':
          endpoint = `/show-excel-methode`;
          break;
        case 'showDownloadVideo':
          endpoint = `/download-video`;
          break;
        default:
          throw new Error('Invalid attribute');
      }
      
      // Make the PATCH request
      const response = await axiosInstance.patch(
        `/entreprises/${localEntreprise.id}${endpoint}`,
        null,
        {
          params: { [attribute]: !currentValue },
        }
      );

      // Update the local state with the updated entreprise data
      setLocalEntreprise(response.data);
    } catch (error) {
      console.error(`Error updating ${attribute}:`, error);
      alert(t('errors.updateFailed', { attribute: t(`attributes.${attribute}`) })); // Use translation for error message
    } finally {
      // Reset loading state
      setLoading((prev) => ({ ...prev, [attribute]: false }));
    }
  };

  // Check if the current language is Arabic for RTL support
  const isArabic = localStorage.getItem('i18nextLng') === 'ar';

  return (
    <div className={`bg-gradient-to-br relative from-gray-100 to-white shadow-md rounded-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-lg hover:bg-gradient-to-bl ${isArabic ? 'text-right' : 'text-left'}`}>
      <button
        className="px-2 py-2 absolute top-0 right-0 text-blue-600 hover:text-blue-800 transition-all"
        onClick={handleUpdate}
        title={t('editEntreprise')}
      >
        <FiEdit size={20} />
      </button>
      <div className="p-6 space-y-4">
        <div className="flex items-center">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={`${localEntreprise.nomCommercial} logo`}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
          )}
          <h3 className="text-lg md:text-xl font-bold text-gray-800 flex items-center truncate">
            {localEntreprise.nomCommercial}
          </h3>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p className="flex items-center">
            <FaIdBadge className="mr-2 text-gray-400" /> {t('rcLabel')}: {localEntreprise.numeroRC}
          </p>
          <p className="flex items-center">
            <FaRegAddressCard className="mr-2 text-gray-400" /> {t('cnssLabel')}: {localEntreprise.numeroCNSS}
          </p>
          <p className="flex items-center">
            <FaRegAddressCard className="mr-2 text-gray-400" /> {t('ifLabel')}: {localEntreprise.numeroIF}
          </p>
          <p className="flex items-center">
            <FaRegAddressCard className="mr-2 text-gray-400" /> {t('tpLabel')}: {localEntreprise.numeroTP}
          </p>
          <p className="flex items-center">
            <FaUsers className="mr-2 text-gray-400" /> {t('employeesLabel')}: {localEntreprise.nombreSalaries}
          </p>
        </div>
        {/* New Attributes Section */}
        <div className="mt-4">
          <h4 className="text-md font-semibold text-gray-700 mb-2">{t('settingsTitle')}</h4>
          <div className="space-y-2">
            {/* showQuizResult Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('showQuizResult')}</span>
              <Switch
                onChange={() => handleToggle('showQuizResult')}
                checked={localEntreprise.showQuizResult}
                disabled={loading.showQuizResult}
                onColor="#4ade80"
                offColor="#d1d5db"
                checkedIcon={false}
                uncheckedIcon={false}
                height={20}
                width={48}
              />
            </div>
            {/* showQuizCorrection Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('showQuizCorrection')}</span>
              <Switch
                onChange={() => handleToggle('showQuizCorrection')}
                checked={localEntreprise.showQuizCorrection}
                disabled={loading.showQuizCorrection}
                onColor="#4ade80"
                offColor="#d1d5db"
                checkedIcon={false}
                uncheckedIcon={false}
                height={20}
                width={48}
              />
            </div>
            {/* showExcelMethode Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('showExcelMethode')}</span>
              <Switch
                onChange={() => handleToggle('showExcelMethode')}
                checked={localEntreprise.showExcelMethode}
                disabled={loading.showExcelMethode}
                onColor="#4ade80"
                offColor="#d1d5db"
                checkedIcon={false}
                uncheckedIcon={false}
                height={20}
                width={48}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('downloadVideo')}</span>
              <Switch
                onChange={() => handleToggle('showDownloadVideo')}
                checked={localEntreprise.showDownloadVideo}
                disabled={loading.showDownloadVideo}
                onColor="#4ade80"
                offColor="#d1d5db"
                checkedIcon={false}
                uncheckedIcon={false}
                height={20}
                width={48}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 pb-6 flex items-center justify-center gap-2">
        <button
          onClick={() => {
            navigate(`/admin/responsable/${localEntreprise.id}`);
          }}
          className="px-2 py-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium text-xs rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all"
        >
          {t('responsablesButton')}
        </button>
        <button
          onClick={() => {
            navigate(`/admin/participant/${localEntreprise.id}`);
          }}
          className="px-2 py-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium text-xs rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all"
        >
          {t('participantButton')}
        </button>
        <button
          onClick={() => {
            navigate(`/admin/formateur/${localEntreprise.id}`);
          }}
          className="px-2 py-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium text-xs rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all"
        >
          {t('formateursButton')}
        </button>
      </div>
    </div>
  );
};

export default EntrepriseCard;
