import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Icons for verify and refuse
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // For multi-language support
import { getUser } from '../helper/auth';

const ParticipantCard = ({ participant, onVerify }) => {
    const { t, i18n } = useTranslation('pages/participantCard'); // Hook for multi-language support
    const [loadedImageUrl, setLoadedImageUrl] = useState(null);
    const id = getUser().userId;

    useEffect(() => {
        const fetchImageWithAuth = async () => {
            try {
                const response = await axiosInstance.get(`http://localhost:8087/api${participant.profileImagePath}`, {
                    responseType: 'blob',
                });
                const imageUrl = URL.createObjectURL(response.data);
                setLoadedImageUrl(imageUrl);
            } catch (error) {
                console.error("Error fetching image:", error);
                setLoadedImageUrl("https://via.placeholder.com/150");
            }
        };

        if (participant.profileImagePath) {
            fetchImageWithAuth();
        } else {
            setLoadedImageUrl("https://via.placeholder.com/150");
        }
    }, [participant.profileImagePath]);

    const handleVerify = async (verify) => {
        try {
            const response = await axiosInstance.put(
                `/responsables/${id}/participants/${participant.userId}/verify?verify=${verify}`
            );
            toast.success(response.data);
            onVerify(participant.userId); // Refresh parent component state after verify/refuse action
        } catch (error) {
            toast.error(t('error.processing_participant'));
        }
    };

    return (
        <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${i18n.language === 'ar' ? 'text-right' : ''}`}>
            <img
                src={loadedImageUrl || "https://via.placeholder.com/150"}
                alt={`${participant.firstName} ${participant.lastName}`}
                className="w-full h-40 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    {participant.firstName} {participant.lastName}
                </h3>
                <p className="text-sm text-gray-600">{participant.email}</p>
                <div className="mt-4 flex space-x-3">
                    <button
                        onClick={() => handleVerify(true)}
                        className="text-green-500 hover:text-green-700"
                        aria-label={t('buttons.verify')}
                    >
                        <FaCheck />
                    </button>
                    <button
                        onClick={() => handleVerify(false)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={t('buttons.refuse')}
                    >
                        <FaTimes />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ParticipantCard;
