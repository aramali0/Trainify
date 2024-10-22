import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const ViewQuizPage = ({ nom }) => {
    const { sectionId } = useParams();
    const { quizId } = useParams();
    const { t } = useTranslation('pages/viewQuizPage'); // Initialize translation
    const [questions, setQuestions] = useState([]);
    const [optionsMap, setOptionsMap] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestionsAndOptions = async () => {
            try {
                // Fetch questions for the section
                const questionsResponse = await axiosInstance.get(`questions/quiz/${quizId}`);
                const questionsData = questionsResponse.data;
                setQuestions(questionsData);

                // Fetch options for each question
                const fetchOptions = async (questionIds) => {
                    try {
                        const optionsResponses = await Promise.all(questionIds.map(id =>
                            axiosInstance.get(`/questions/${id}/options`)
                        ));
                        const options = optionsResponses.reduce((acc, response) => {
                            const optionList = response.data;
                            optionList.forEach(option => {
                                if (!acc[option.questionId]) {
                                    acc[option.questionId] = [];
                                }
                                acc[option.questionId].push(option);
                            });
                            return acc;
                        }, {});
                        setOptionsMap(options);
                    } catch (error) {
                        toast.error(t('errors.failedToLoadOptions')); // Use translation
                    }
                };

                const questionIds = questionsData.map(question => question.id);
                fetchOptions(questionIds);
            } catch (error) {
                toast.error(t('errors.failedToLoadQuestions')); // Use translation
            } finally {
                setLoading(false);
            }
        };

        fetchQuestionsAndOptions();
    }, [quizId, t]);

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{t('viewQuiz.title')}</h1>
                <Link to={`${nom}/quiz/${quizId}/edit-quiz`} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    {t('viewQuiz.editQuiz')}
                </Link>
            </div>
            {loading ? (
                <p>{t('viewQuiz.loading')}</p>
            ) : questions.length === 0 ? (
                <p>{t('viewQuiz.noQuestions')}</p>
            ) : (
                <div>
                    {questions.map(question => (
                        <div key={question.id} className="mb-6 p-4 border rounded shadow-md">
                            <h2 className="text-xl font-semibold mb-2">{question.text}</h2>
                            <div className="text-gray-700">
                                {optionsMap[question.id]?.map(option => (
                                    <div key={option.id} className="mb-2">
                                        <input
                                            type="radio"
                                            id={`option-${option.id}`}
                                            name={`question-${question.id}`}
                                            value={option.id}
                                            disabled
                                        />
                                        <label htmlFor={`option-${option.id}`} className="ml-2">{option.optionText}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewQuizPage;
