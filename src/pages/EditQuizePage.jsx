import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const EditQuizPage = ({ nom }) => {
    const { t, i18n } = useTranslation('pages/editQuizPage'); // Add translation hooks
    const [questions, setQuestions] = useState([]);
    const [optionsMap, setOptionsMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [newQuestionText, setNewQuestionText] = useState('');
    const [newQuestionType, setNewQuestionType] = useState('multiple-choice');
    const [newOptionText, setNewOptionText] = useState('');
    const [newOptionIsCorrect, setNewOptionIsCorrect] = useState(false);
    const [currentQuestionId, setCurrentQuestionId] = useState(null);
    const { quizId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestionsAndOptions = async () => {
            try {
                const questionsResponse = await axiosInstance.get(`/questions/quiz/${quizId}`);
                const questionsData = questionsResponse.data;
                setQuestions(questionsData);

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
                        toast.error(t("Failed to load options"));
                    }
                };

                const questionIds = questionsData.map(question => question.id);
                if (questionIds.length > 0) {
                    fetchOptions(questionIds);
                }
            } catch (error) {
                toast.error(t("Failed to load questions"));
            } finally {
                setLoading(false);
            }
        };

        fetchQuestionsAndOptions();
    }, [quizId, t]);

    const handleDeleteQuestion = async (questionId) => {
        if (window.confirm(t("Are you sure you want to delete this question?"))) {
            try {
                await axiosInstance.delete(`/questions/${questionId}`);
                setQuestions(questions.filter(q => q.id !== questionId));
                setOptionsMap(prevOptions => {
                    const updatedOptions = { ...prevOptions };
                    delete updatedOptions[questionId];
                    return updatedOptions;
                });
                toast.success(t("Question deleted successfully"));
            } catch (error) {
                toast.error(t("Failed to delete question"));
            }
        }
    };

    const handleDeleteOption = async (optionId) => {
        if (window.confirm(t("Are you sure you want to delete this option?"))) {
            try {
                await axiosInstance.delete(`/options/${optionId}`);
                setOptionsMap(prevOptions => {
                    const updatedOptions = { ...prevOptions };
                    Object.keys(updatedOptions).forEach(questionId => {
                        updatedOptions[questionId] = updatedOptions[questionId].filter(option => option.id !== optionId);
                    });
                    return updatedOptions;
                });
                toast.success(t("Option deleted successfully"));
            } catch (error) {
                toast.error(t("Failed to delete option"));
            }
        }
    };

    const handleAddQuestion = async () => {
        if (!newQuestionText.trim()) {
            toast.error(t("Question text cannot be empty"));
            return;
        }
        try {
            const response = await axiosInstance.post('/questions', {
                text: newQuestionText,
                type: newQuestionType,
                quizId: quizId,
            });
            const newQuestion = response.data;
            setQuestions([...questions, newQuestion]);
            setNewQuestionText('');
            setNewQuestionType('multiple-choice');
            toast.success(t("Question added successfully"));
        } catch (error) {
            toast.error(t("Failed to add question"));
        }
    };

    const handleAddOption = async () => {
        if (!newOptionText.trim() || currentQuestionId === null) {
            toast.error(t("Option text cannot be empty and no question selected"));
            return;
        }
        try {
            const response = await axiosInstance.post('/options', {
                optionText: newOptionText,
                isCorrect: newOptionIsCorrect,
                questionId: currentQuestionId
            });
            const newOption = response.data;

            setNewOptionText('');
            setNewOptionIsCorrect(false);

            setOptionsMap(prevOptions => {
                const updatedOptions = { ...prevOptions };
                if (!updatedOptions[currentQuestionId]) {
                    updatedOptions[currentQuestionId] = [];
                }
                updatedOptions[currentQuestionId].push(newOption);
                return updatedOptions;
            });
            toast.success(t("Option added successfully"));
        } catch (error) {
            toast.error(t("Failed to add option"));
        }
    };

    return (
        <div className={`max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md ${i18n.language === 'ar' ? 'text-right' : ''}`}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{t("Edit Quiz")}</h1>
            </div>
            {loading ? (
                <p>{t("Loading quiz...")}</p>
            ) : questions.length === 0 ? (
                <p>{t("No questions available")}</p>
            ) : (
                <div>
                    {questions.map(question => (
                        <div key={question.id} className="mb-6 p-4 border rounded shadow-md">
                            <h2 className="text-xl font-semibold mb-2">{question.text}</h2>
                            <div className="text-gray-700 mb-4">
                                {optionsMap[question.id]?.map(option => (
                                    <div key={option.id} className="mb-2 flex items-center">
                                        <input
                                            type="text"
                                            value={option.optionText}
                                            disabled
                                            className="border p-2 rounded mr-2 flex-grow"
                                        />
                                        {option.isCorrect && (
                                            <span className="text-green-500 font-semibold mr-2">{t("Correct")}</span>
                                        )}
                                        <button
                                            onClick={() => handleDeleteOption(option.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            {t("Delete Option")}
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => handleDeleteQuestion(question.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    {t("Delete Question")}
                                </button>
                                <Link
                                    to={`${nom}/questions/edit/${question.id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {t("Edit Question")}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-6 p-4 border-t">
                <h2 className="text-lg font-semibold mb-4">{t("Add New Question")}</h2>
                <input
                    type="text"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder={t("Enter new question")}
                    className="border p-2 rounded w-full mb-4"
                />
                <select
                    value={newQuestionType}
                    onChange={(e) => setNewQuestionType(e.target.value)}
                    className="border p-2 rounded w-full mb-4"
                >
                    <option value="multiple-choice">{t("Multiple Choice")}</option>
                    <option value="single-choice">{t("Single Choice")}</option>
                    <option value="true-false">{t("True/False")}</option>
                </select>
                <button
                    onClick={handleAddQuestion}
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {t("Add Question")}
                </button>
            </div>
            {questions.length > 0 && (
                <div className="mt-6 p-4 border-t">
                    <h2 className="text-lg font-semibold mb-4">{t("Add New Option")}</h2>
                    <select
                        value={currentQuestionId || ''}
                        onChange={(e) => setCurrentQuestionId(Number(e.target.value))}
                        className="border p-2 rounded w-full mb-4"
                    >
                        <option value="">{t("Select Question")}</option>
                        {questions.map(question => (
                            <option key={question.id} value={question.id}>
                                {question.text}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={newOptionText}
                        onChange={(e) => setNewOptionText(e.target.value)}
                        placeholder={t("Enter new option")}
                        className="border p-2 rounded w-full mb-4"
                    />
                    <label className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            checked={newOptionIsCorrect}
                            onChange={(e) => setNewOptionIsCorrect(e.target.checked)}
                            className="mr-2"
                        />
                        {t("Mark as Correct")}
                    </label>
                    <button
                        onClick={handleAddOption}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {t("Add Option")}
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditQuizPage;
