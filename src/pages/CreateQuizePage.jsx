import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { getUser } from '../helper/auth';
import { ClipLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const CreateQuizPage = ({ nom }) => {
    const { sectionId } = useParams();
    const { t } = useTranslation('pages/createQuiz'); // Initialize translation
    const [evaluationType, setEvaluationType] = useState('preliminary-assessment');
    const [quizName, setQuizName] = useState('');
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const userId = getUser().userId;

    const [questions, setQuestions] = useState([
        { text: '', type: 'multiple-choice', options: [{ text: '', isCorrect: false }] }
    ]);

    const [errors, setErrors] = useState([]);

    const handleAddQuestion = () => {
        setQuestions([...questions, { text: '', type: 'multiple-choice', options: [{ text: '', isCorrect: false }] }]);
    };

    const handleRemoveQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = questions.map((question, i) =>
            i === index ? { ...question, [field]: value } : question
        );
        setQuestions(updatedQuestions);
    };

    const handleAddOption = (questionIndex) => {
        const updatedQuestions = questions.map((question, i) =>
            i === questionIndex ? { ...question, options: [...question.options, { text: '', isCorrect: false }] } : question
        );
        setQuestions(updatedQuestions);
    };

    const handleRemoveOption = (questionIndex, optionIndex) => {
        const updatedQuestions = questions.map((question, i) =>
            i === questionIndex ? {
                ...question,
                options: question.options.filter((_, j) => j !== optionIndex)
            } : question
        );
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, field, value) => {
        const updatedQuestions = questions.map((question, i) =>
            i === questionIndex ? {
                ...question,
                options: question.options.map((option, j) =>
                    j === optionIndex ? { ...option, [field]: value } : option
                )
            } : question
        );
        setQuestions(updatedQuestions);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = [];

        questions.forEach((question, qIndex) => {
            const questionErrors = {};
            if (!question.text.trim()) {
                questionErrors.text = t('errors.questionRequired'); // Use translation
                isValid = false;
            }

            if (question.options.length === 0) {
                questionErrors.options = t('errors.optionRequired'); // Use translation
                isValid = false;
            } else {
                const hasCorrectOption = question.options.some(option => option.isCorrect);
                if (question.type === 'multiple-choice' && !hasCorrectOption) {
                    questionErrors.options = t('errors.correctOptionRequired'); // Use translation
                    isValid = false;
                }
                question.options.forEach((option, oIndex) => {
                    if (!option.text.trim()) {
                        if (!questionErrors.options) {
                            questionErrors.options = {};
                        }
                        questionErrors.options[oIndex] = t('errors.optionTextRequired'); // Use translation
                        isValid = false;
                    }
                });
            }

            if (Object.keys(questionErrors).length > 0) {
                newErrors[qIndex] = questionErrors;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const quizResponse = await axiosInstance.post(`quizzes/sections/${sectionId}`, {
                title: quizName,
                type: evaluationType,
                createdBy: userId
            });
            const quizId = quizResponse.data.id;

            const questionResponses = await Promise.all(
                questions.map(question =>
                    axiosInstance.post(`/quizzes/${quizId}/questions`, {
                        text: question.text,
                        type: question.type
                    })
                )
            );

            await Promise.all(
                questionResponses.map((response, index) =>
                    Promise.all(
                        questions[index].options.map(option =>
                            axiosInstance.post(`/questions/${response.data.id}/options`, {
                                optionText: option.text,
                                isCorrect: option.isCorrect
                            })
                        )
                    )
                )
            );

            setLoading(false);
            toast.success(t('toast.quizCreatedSuccess')); // Use translation
            navigate(`${nom}/sections`);
        } catch (error) {
            toast.error(t('toast.quizCreationFailed')); // Use translation
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">{t('createQuiz.title')}</h1>
            <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">{t('createQuiz.quizName')}</label>
                <input
                    type="text"
                    value={quizName}
                    onChange={(e) => setQuizName(e.target.value)}
                    placeholder={t('createQuiz.quizNamePlaceholder')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">{t('createQuiz.evaluationType')}</label>
                <select
                    value={evaluationType}
                    onChange={(e) => setEvaluationType(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                >
                    <option value="preliminary-assessment">{t('createQuiz.evaluationOptions.preliminaryAssessment')}</option>
                    <option value="hot-evaluation">{t('createQuiz.evaluationOptions.hotEvaluation')}</option>
                    <option value="cold-assessment">{t('createQuiz.evaluationOptions.coldAssessment')}</option>
                </select>
            </div>
            <form onSubmit={handleSubmit}>

                {questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="bg-white p-6 mb-6 rounded-lg shadow-md">
                        <div className="mb-4">
                            <label className="block text-lg font-medium text-gray-700">{t('createQuiz.question', { index: questionIndex + 1 })}</label>
                            <input
                                type="text"
                                value={question.text}
                                onChange={(e) => handleQuestionChange(questionIndex, 'text', e.target.value)}
                                placeholder={t('createQuiz.questionPlaceholder')}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                                required
                            />
                            {errors[questionIndex]?.text && <p className="text-red-500 text-sm mt-1">{errors[questionIndex]?.text}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-lg font-medium text-gray-700">{t('createQuiz.questionType')}</label>
                            <select
                                value={question.type}
                                onChange={(e) => handleQuestionChange(questionIndex, 'type', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                            >
                                <option value="multiple-choice">{t('createQuiz.questionTypeOptions.multipleChoice')}</option>
                                <option value="single-choice">{t('createQuiz.questionTypeOptions.singleChoice')}</option>
                                <option value="true-false">{t('createQuiz.questionTypeOptions.trueFalse')}</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-lg font-medium text-gray-700">{t('createQuiz.options')}</label>
                            {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="mb-3 flex items-center">
                                    <input
                                        type="text"
                                        value={option.text}
                                        onChange={(e) => handleOptionChange(questionIndex, optionIndex, 'text', e.target.value)}
                                        placeholder={t('createQuiz.optionPlaceholder', { index: optionIndex + 1 })}
                                        className="mr-3 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                                        required
                                    />
                                    <input
                                        type="checkbox"
                                        checked={option.isCorrect}
                                        onChange={(e) => handleOptionChange(questionIndex, optionIndex, 'isCorrect', e.target.checked)}
                                        className="mr-2"
                                    />
                                    <label className="text-sm text-gray-600">{t('createQuiz.correctAnswer')}</label>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                                        className="ml-3 text-red-600 hover:text-red-800"
                                    >
                                        {t('createQuiz.removeOption')}
                                    </button>
                                    {errors[questionIndex]?.options?.[optionIndex] && <p className="text-red-500 text-sm mt-1">{errors[questionIndex].options[optionIndex]}</p>}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleAddOption(questionIndex)}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                {t('createQuiz.addOption')}
                            </button>
                            {errors[questionIndex]?.options && !Array.isArray(errors[questionIndex]?.options) && (
                                <p className="text-red-500 text-sm mt-1">{errors[questionIndex].options}</p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveQuestion(questionIndex)}
                            className="text-red-600 hover:text-red-800"
                        >
                            {t('createQuiz.removeQuestion')}
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="mb-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                    {t('createQuiz.addQuestion')}
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`group relative w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                        isLoading
                            ? 'bg-indigo-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                    {isLoading ? (
                        <>
                            <ClipLoader size={20} color="#ffffff" className="mr-2" />
                            {t('createQuiz.loading')}
                        </>
                    ) : (
                        t('createQuiz.submit')
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreateQuizPage;
