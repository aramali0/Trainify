import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';

const EvaluationResponsesPage = () => {
    const { evaluationId } = useParams();
    const { t } = useTranslation("pages/evaluation-formation");
    const [responses, setResponses] = useState([]);
    const [userMap, setUserMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [blockDetails, setBlockDetails] = useState([]); // For storing block details

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const response = await axiosInstance.get(`/responses-formation/evaluation/${evaluationId}`);
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
    }, [evaluationId]);

    const openModal = async (response) => {
        setSelectedResponse(response);

        try {
            const blockDetailsPromises = response.blockAnswers.map(async (block) => {
                const blockResponse = await axiosInstance.get(`/evaluations-formation/block/${block.blockId}`);
                return {
                    name: blockResponse.data.title, // Assuming the backend returns `name`
                    percentage: block.totalScore, // Assuming percentage is part of the block answer
                };
            });

            const details = await Promise.all(blockDetailsPromises);
            setBlockDetails(details);
        } catch (error) {
            console.error(t('error.fetchingBlockDetails'), error);
            toast.error(t('error.failedToLoadBlockDetails'));
        }
    };

    const closeModal = () => {
        setSelectedResponse(null);
        setBlockDetails([]);
    };

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
                                <th className="border-b px-4 py-3">{t('evaluation.totalScore')}</th>
                                <th className="border-b px-4 py-3">{t('evaluation.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {responses.map(response => (
                                <tr key={response.id} className="odd:bg-gray-50 even:bg-white">
                                    <td className="border-t px-4 py-3">
                                        {userMap[response.userId] || `${t('evaluation.userId')}: ${response.userId}`}
                                    </td>
                                    <td className="border-t px-4 py-3 text-gray-800 font-semibold">
                                        {response.totalScore.toFixed(2) + "%" }
                                    </td>
                                    <td className="border-t px-4 py-3 text-sm">
                                        <button
                                            onClick={() => openModal(response)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            {t('evaluation.seeMore')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center text-xl text-gray-600">{t('evaluation.noResponses')}</div>
            )}

            {/* Modal for block details */}
            {selectedResponse && (
                <div className="fixed inset-0 top-20 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg relative">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">{t('evaluation.responseDetails')}</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-red-500 transition"
                            >
                                &times;
                            </button>
                        </div>
                        <p className="mb-2"><strong>{t('evaluation.user')}:</strong> {userMap[selectedResponse.userId]}</p>
                        <p className="mb-4"><strong>{t('evaluation.totalScore')}:</strong> {selectedResponse.totalScore}</p>

                        <div
                            className="overflow-y-auto max-h-80 border-t pt-4"
                            style={{ scrollbarWidth: "thin", scrollbarColor: "#ccc #f0f0f0" }}
                        >
                            <h3 className="text-lg font-semibold mb-2">{t('evaluation.blockDetails')}</h3>
                            {blockDetails.map((block, index) => (
                                <div key={index} className="mb-4">
                                    <p className="font-medium">{block.name}</p>
                                    <p className="text-sm text-gray-600">{t('evaluation.percentage')}: {block.percentage}%</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                {t('common.close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EvaluationResponsesPage;
