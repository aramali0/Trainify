import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { getUser } from '../helper/auth';
import { useTranslation } from 'react-i18next';

const QuizPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation('pages/quizPage'); // Use translation hook
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [options, setOptions] = useState({});
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const userId = getUser().userId;

    useEffect(() => {
        setStartTime(Date.now());

        const fetchQuestions = async () => {
            try {
                const response = await axiosInstance.get(`/questions/quiz/${quizId}`);
                setQuestions(response.data);

                response.data.forEach(async (question) => {
                    const optionResponse = await axiosInstance.get(`/options/by-question/${question.id}`);
                    setOptions(prevOptions => ({
                        ...prevOptions,
                        [question.id]: optionResponse.data
                    }));
                });
            } catch (error) {
                toast.error(t("quiz.loadError"));
            }
        };

        fetchQuestions();
    }, [quizId]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (startTime) {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime]);

    const isMultipleChoice = (type) => type === "multiple-choice";

    const handleChange = (questionId, optionId, type) => {
        const allowMultiple = isMultipleChoice(type);
        setResponses(prevResponses => {
            const currentSelections = prevResponses[questionId] || [];
            if (allowMultiple) {
                if (currentSelections.includes(optionId)) {
                    return {
                        ...prevResponses,
                        [questionId]: currentSelections.filter(id => id !== optionId)
                    };
                } else {
                    return {
                        ...prevResponses,
                        [questionId]: [...currentSelections, optionId]
                    };
                }
            } else {
                return {
                    ...prevResponses,
                    [questionId]: [optionId]
                };
            }
        });
    };

    const handleSubmit = async () => {
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        const responseDtos = Object.entries(responses).map(([questionId, optionIds]) => ({
            questionId: Number(questionId),
            optionId: Array.isArray(optionIds) ? optionIds.map(id => Number(id)) : [Number(optionIds)],
            evaluationId: null,
            id: null
        }));

        try {
            const response = await axiosInstance.post(`/quizzes/${quizId}/submit-quiz?participantId=${userId}&timeTaken=${timeTaken}`, responseDtos);
            toast.success(t("quiz.submitSuccess"));
            setQuizSubmitted(true);
            navigate(`/participant/quizes/${quizId}/result`);
        } catch (error) {
            console.log(error.response);
            toast.error(error.response?.data || t("quiz.submitError"));
        }
    };

    const nextQuestion = () => {
        const currentQuestion = questions[currentQuestionIndex];
        const selectedOptions = responses[currentQuestion.id];
        const allowMultiple = isMultipleChoice(currentQuestion.type);

        if (
            (allowMultiple && selectedOptions && selectedOptions.length > 0) ||
            (!allowMultiple && selectedOptions && selectedOptions.length === 1)
        ) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            toast.error(t("quiz.selectError"));
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (!questions.length) return <div>Loading...</div>;

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{t("quiz.title")}</h1>

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {t("quiz.question")} {currentQuestionIndex + 1} {t("quiz.of")} {questions.length}
                </h2>
                <div className="w-1/3">
                    <div className="relative pt-1">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                            <div
                                style={{ width: `${progress}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
                            ></div>
                        </div>
                    </div>
                </div>
                <div className="text-lg font-medium text-gray-800">
                    {t("quiz.timeTaken")}: {formatTime(elapsedTime)}
                </div>
            </div>

            <form>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">{currentQuestion.text}</h2>
                    <div className="space-y-2">
                        {(options[currentQuestion.id] || []).map(option => (
                            <label key={option.id} className="flex items-center">
                                <input
                                    type={isMultipleChoice(currentQuestion.type) ? "checkbox" : "radio"}
                                    name={`question-${currentQuestion.id}`}
                                    value={option.id}
                                    checked={
                                        isMultipleChoice(currentQuestion.type)
                                            ? (responses[currentQuestion.id] || []).includes(option.id)
                                            : (responses[currentQuestion.id] && responses[currentQuestion.id][0] === option.id)
                                    }
                                    onChange={() => handleChange(currentQuestion.id, option.id, currentQuestion.type)}
                                    className="mr-2"
                                />
                                {option.optionText}
                            </label>
                        ))} 
                    </div>
                </div>

                <div className="flex justify-between mt-8">
                    <button
                        type="button"
                        onClick={prevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
                    >
                        {t("quiz.previous")}
                    </button>
                    {isLastQuestion ? (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className={`px-4 py-2 ${quizSubmitted ? 'bg-gray-300' : 'bg-green-500 hover:bg-green-600'}`}
                            disabled={quizSubmitted}
                        >
                            {quizSubmitted ? t("quiz.submitted") : t("quiz.reviewAndSubmit")}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={nextQuestion}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                        >
                            {t("quiz.next")}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default QuizPage;
