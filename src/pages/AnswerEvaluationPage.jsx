import React, { useEffect, useState } from 'react';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser } from '../helper/auth';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';

const AnswerEvaluationPage = ({ nom }) => {
    const { evaluationId } = useParams();
    const [evaluation, setEvaluation] = useState(null);
    const [blockAnswers, setBlockAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const userId = getUser().userId;
    const { t } = useTranslation("pages/answerEvaluation");

    useEffect(() => {
        const fetchEvaluation = async () => {
            try {
                const response = await axiosInstance.get(`/evaluations-formation/${evaluationId}`);
                setEvaluation(response.data);

                // Initialize blockAnswers object with default values for each question
                const initialBlockAnswers = {};
                response.data.blocks.forEach((block) => {
                    initialBlockAnswers[block.id] = {};
                    block.questions.forEach((question) => {
                        initialBlockAnswers[block.id][question] = 1; // Default score for each question
                    });
                });
                setBlockAnswers(initialBlockAnswers);
            } catch (error) {
                console.error(t('answerEvaluation.errorFetching'), error);
                toast.error(t('answerEvaluation.errorLoading'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvaluation();
    }, [evaluationId, t]);

    const handleSubmit = async () => {
        try {
            const payload = {
                evaluationId: evaluation.id,
                userId,
                blockAnswers: Object.entries(blockAnswers).map(([blockId, answers]) => ({
                    blockId: parseInt(blockId, 10),
                    answers: answers
                })),
            };
            const response = await axiosInstance.post('/responses-formation', payload);
            toast.success(
                `${t('answerEvaluation.successMessage')} ${response.data.totalScore}%`
            );
            navigate(`${nom}/evaluation-formations`);
        } catch (error) {
            console.error(t('answerEvaluation.errorSubmitting'), error);
            toast.error(t('answerEvaluation.submitFailed'));
        }
    };

    const handleChange = (blockId, question, value) => {
        setBlockAnswers((prev) => ({
            ...prev,
            [blockId]: {
                ...prev[blockId],
                [question]: value,
            },
        }));
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-gradient-to-r from-gray-100 to-gray-200">
            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="text-gray-600 text-lg">{t('answerEvaluation.loading')}</div>
                </div>
            ) : evaluation ? (
                <div className="bg-white p-8 shadow-md rounded-lg">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                        <FaCheckCircle className="mr-3 text-green-600" />
                        {evaluation.title}
                    </h1>
                    <div className="space-y-6">
                        {evaluation.blocks.map((block) => (
                            <div key={block.id} className="mb-6">
                                <h2 className="text-2xl font-semibold text-gray-700 mb-4">{block.title}</h2>
                                {block.questions.map((question) => (
                                    <div key={question} className="mb-4">
                                        <p className="mb-2 text-lg font-medium text-gray-700">{question}</p>
                                        <select
                                            className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={blockAnswers[block.id]?.[question] || 1}
                                            onChange={(e) =>
                                                handleChange(block.id, question, parseInt(e.target.value, 10))
                                            }
                                        >
                                            <option value={1}>{t('answerEvaluation.option1')}</option>
                                            <option value={2}>{t('answerEvaluation.option2')}</option>
                                            <option value={3}>{t('answerEvaluation.option3')}</option>
                                            <option value={4}>{t('answerEvaluation.option4')}</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="mt-6 px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center w-full"
                    >
                        <FaCheckCircle className="mr-2" />
                        {t('answerEvaluation.submitButton')}
                    </button>
                </div>
            ) : (
                <div className="flex justify-center items-center h-48 text-red-600">
                    <MdErrorOutline className="mr-2 text-2xl" />
                    {t('answerEvaluation.notFound')}
                </div>
            )}
        </div>
    );
};

export default AnswerEvaluationPage;
