import React, { useState, useEffect } from 'react';
import axiosInstance from '../helper/axios';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // i18n for multi-language
import { getUser } from '../helper/auth';
import ParticipantCard from '../components/ParticipantCard';

const ParticipantsPage = () => {
    const { t, i18n } = useTranslation('pages/participantsPage');
    const id = getUser().userId;
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const response = await axiosInstance.get(`/responsables/${id}/participants/verification`);
                setParticipants(response.data);
            } catch (error) {
                toast.error(t('error.loading_participants'));
            } finally {
                setLoading(false);
            }
        };

        fetchParticipants();
    }, [id, t]);

    const handleVerifyAction = (userId) => {
        // Remove participant from list after verification/refusal
        setParticipants(prevParticipants =>
            prevParticipants.filter(participant => participant.userId !== userId)
        );
    };

    if (loading) return <p>{t('loading')}</p>;

    return (
        <div className={`p-6 max-w-7xl mx-auto ${i18n.language === 'ar' ? 'text-right' : ''}`}>
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-6">{t('participants.title')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {participants.map(participant => (
                    <ParticipantCard
                        key={participant.userId}
                        participant={participant}
                        onVerify={handleVerifyAction}
                    />
                ))}
            </div>
        </div>
    );
};

export default ParticipantsPage;
