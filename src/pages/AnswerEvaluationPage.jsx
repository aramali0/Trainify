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
    const [answers, setAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const userId = getUser().userId;
    const { t } = useTranslation("pages/answerEvaluation");

    useEffect(() => {
        const fetchEvaluation = async () => {
            try {
                const response = await axiosInstance.get(`/evaluations-formation/evaluation/${evaluationId}`);
                setEvaluation(response.data);
                const initialAnswers = {};
                response.data.questions.forEach((q) => {
                    initialAnswers[q] = 1; // Default score for each question
                });
                setAnswers(initialAnswers);
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
                entrepriseId: evaluation.entrepriseId,
                answers,
            };
            const response = await axiosInstance.post('/responses-formation', payload);
            toast.success(
                `${t('answerEvaluation.successMessage')} ${response.data.percentage}%`
            );
            navigate(`${nom}/evaluation-formations`);
        } catch (error) {
            console.error(t('answerEvaluation.errorSubmitting'), error);
            toast.error(t('answerEvaluation.submitFailed'));
        }
    };

    const handleChange = (question, value) => {
        setAnswers((prev) => ({
            ...prev,
            [question]: value,
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
                        {evaluation.questions.map((question, index) => (
                            <div key={index} className="mb-4">
                                <p className="mb-2 text-lg font-medium text-gray-700">{question}</p>
                                <select
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={answers[question]}
                                    onChange={(e) =>
                                        handleChange(question, parseInt(e.target.value, 10))
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
