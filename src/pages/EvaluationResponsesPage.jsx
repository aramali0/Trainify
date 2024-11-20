import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const EvaluationResponsesPage = () => {
    const { evaluationId } = useParams();
    const { t } = useTranslation("pages/evaluation-formation");
    const [responses, setResponses] = useState([]);
    const [userMap, setUserMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const response = await axiosInstance.get(`/responses-formation/${evaluationId}`);
                setResponses(response.data);

                // Fetch user details
                const userIds = [...new Set(response.data.map(r => r.userId))];
                const userDetails = await Promise.all(
                    userIds.map(id => axiosInstance.get(`/users/${id}`).catch(() => null))
                );

                const userMap = userDetails.reduce((acc, res) => {
                    if (res?.data) {
                        const { userId, firstName, lastName } = res.data;
                        acc[userId] = `${firstName} ${lastName}`;
                    }
                    return acc;
                }, {});
                setUserMap(userMap);
            } catch (error) {
                console.error(t('error.fetchingResponses'), error);
                toast.error(t('error.failedToLoadResponses'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchResponses();
    }, [evaluationId, t]);

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gradient-to-r from-gray-100 to-gray-200">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-8 text-center">
                {t('evaluation.responsesTitle')}
            </h1>
            {isLoading ? (
                <div className="text-center text-xl text-gray-600">{t('common.loading')}</div>
            ) : responses.length > 0 ? (
                <div className="bg-white shadow-xl rounded-lg p-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 uppercase text-sm">
                                <th className="border-b px-4 py-3">{t('evaluation.user')}</th>
                                <th className="border-b px-4 py-3">{t('evaluation.percentage')}</th>
                                <th className="border-b px-4 py-3">{t('evaluation.answers')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {responses.map(response => (
                                <tr key={response.id} className="odd:bg-gray-50 even:bg-white">
                                    <td className="border-t px-4 py-3">
                                        {userMap[response.userId] || `${t('evaluation.userId')}: ${response.userId}`}
                                    </td>
                                    <td className="border-t px-4 py-3 text-gray-800 font-semibold">
                                        {response.percentage}%
                                    </td>
                                    <td className="border-t px-4 py-3 text-sm">
                                        <ul className="list-disc ml-5">
                                            {Object.entries(response.answers).map(([q, a]) => (
                                                <li key={q}>
                                                    <span className="font-medium text-gray-700">{q}:</span> {a}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center text-xl text-gray-600">{t('evaluation.noResponses')}</div>
            )}
        </div>
    );
};

export default EvaluationResponsesPage;
