import React, { useEffect, useState } from 'react';
import axiosInstance from '../helper/axios';
import { getUser } from '../helper/auth';
import { toast } from 'react-toastify';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
};

const EvaluationDetails = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { t } = useTranslation('pages/evaluationDetails'); // Using useTranslation hook for translations


    const fetchEvaluations = async (pageNumber = 0) => {
        const id = getUser().userId;
        try {
            const response = await axiosInstance.get(`/participants/${id}/evaluations-pagination`, {
                params: {
                    page: pageNumber,
                    size: 10
                }
            });
            setEvaluations(response.data.content);
            setPage(response.data.number);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            toast.error(t('fetchError'));
        }
    };

    useEffect(() => {
        fetchEvaluations();
    }, []);

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('evaluationDetails')}</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {evaluations.map(evaluation => (
                        <div
                            key={evaluation.id}
                            className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 transition-transform transform hover:scale-105 hover:shadow-xl duration-300"
                        >
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">{t('evaluationId')}: {evaluation.id}</h3>
                                <p className="text-gray-700"><strong>{t('type')}:</strong> {evaluation.type}</p>
                                <p className="text-gray-700"><strong>{t('createdAt')}:</strong> {new Date(evaluation.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center mb-4">
                                <div className={`w-16 h-16 flex items-center justify-center rounded-full ${getScoreColor(evaluation.score)} text-white font-bold text-xl`}>
                                    {evaluation.score}
                                </div>
                                <div className="ml-4 flex-1">
                                    <div className="relative pt-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">{t('score')}</span>
                                        </div>
                                        <div className="flex items-center mt-2">
                                            <div className="relative flex-1">
                                                <div className="absolute inset-0 rounded-full bg-gray-200"></div>
                                                <div className={`absolute inset-0 rounded-full ${getScoreColor(evaluation.score)}`} style={{ width: `${Math.min(evaluation.score, 100)}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={() => fetchEvaluations(page - 1)}
                    disabled={page === 0}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50 transition-colors duration-300"
                >
                    {t('previous')}
                </button>
                <span className="text-gray-800">{t('page')} {page + 1} {t('of')} {totalPages}</span>
                <button
                    onClick={() => fetchEvaluations(page + 1)}
                    disabled={page >= totalPages - 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50 transition-colors duration-300"
                >
                    {t('next')}
                </button>
            </div>
        </div>
    );
};

export default EvaluationDetails;
