import React, { useEffect, useState } from 'react';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { getUser } from '../helper/auth';
import { useNavigate } from 'react-router-dom';
import { FaTasks } from 'react-icons/fa';
import { MdQuestionAnswer } from 'react-icons/md';

const EvaluationListForUserPage = ({ role, nom }) => {
    const [evaluations, setEvaluations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation("pages/evaluationForUsersList");
    const userId = getUser().userId;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvaluations = async () => {
            try {
                const response = await axiosInstance.get(`/evaluations-formation/${userId}/${role}`);
                setEvaluations(response.data);
            } catch (error) {
                console.error(t('evaluationList.errorFetching'), error);
                toast.error(t('evaluationList.errorLoading'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvaluations();
    }, [userId, role, t]);

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-100 to-gray-200">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center">
                <FaTasks className="mr-3 text-blue-600" />
                {t('evaluationList.title')}
            </h1>
            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="text-lg text-gray-600">{t('evaluationList.loading')}</div>
                </div>
            ) : evaluations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {evaluations.map((evaluation) => (
                        <div
                            key={evaluation.id}
                            className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300"
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">{evaluation.title}</h2>
                            <button
                                onClick={() =>
                                    navigate(`${nom}/evaluation-formations/${evaluation.id}/answer`)
                                }
                                className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center justify-center transition"
                            >
                                <MdQuestionAnswer className="mr-2" />
                                {t('evaluationList.answerQuestions')}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-lg text-gray-600">{t('evaluationList.noEvaluations')}</div>
            )}
        </div>
    );
};

export default EvaluationListForUserPage;
