import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { getUser } from '../helper/auth';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList, FaEye, FaPlus } from 'react-icons/fa';

const EvaluationListPage = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation("pages/evaluationList");
    const userId = getUser().userId;

    useEffect(() => {
        const fetchEvaluations = async () => {
            try {
                const response = await axiosInstance.get(`/evaluations-formation/${userId}`);
                setEvaluations(response.data);
            } catch (error) {
                console.error(t('error.fetchingEvaluations'), error);
                // toast.error(t('error.failedToLoadEvaluations'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvaluations();
    }, [userId, t]);

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gradient-to-r from-gray-100 to-gray-200">
            <div className='flex justify-between items-center'>

            <h1 className="text-3xl md:text-3xl font-extrabold text-gray-800 mb-8 text-center">
                {t('evaluationList.title')}
            </h1>

            {/* Create Evaluation Button */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => navigate('/responsable/evaluation-formations/create')}
                    className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold text-lg rounded-lg hover:bg-green-700 transition"
                >
                    <FaPlus className="mr-2" />
                    {t('evaluationList.createEvaluation')}
                </button>
            </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center text-xl text-gray-600">
                    {t('common.loading')}...
                </div>
            ) : evaluations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {evaluations.map(evaluation => (
                        <div
                            key={evaluation.id}
                            className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition duration-300"
                        >
                            <div className="flex items-center mb-4">
                                <FaClipboardList className="text-blue-600 text-3xl mr-4" />
                                <h2 className="text-lg font-semibold text-gray-800">{evaluation.title}</h2>
                            </div>
                            <p className="text-gray-600">
                                {t('evaluationList.type')}: {evaluation.type}
                            </p>
                            <button
                                onClick={() => navigate(`/responsable/evaluation-formations/${evaluation.id}`)}
                                className="mt-6 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <FaEye className="mr-2" />
                                {t('evaluationList.viewResponses')}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-xl text-gray-600">
                    {t('evaluationList.noEvaluations')}
                </div>
            )}
        </div>
    );
};

export default EvaluationListPage;
