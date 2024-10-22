import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const EditQuestionPage = ({ nom }) => {
    const { t, i18n } = useTranslation('pages/editQuestionPage'); // Add translation hooks
    const { questionId } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [questionText, setQuestionText] = useState('');
    const [questionType, setQuestionType] = useState('multiple-choice');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axiosInstance.get(`/questions/${questionId}`);
                setQuestion(response.data);
                setQuestionText(response.data.text);
                setQuestionType(response.data.type);
            } catch (error) {
                toast.error(t("Failed to fetch question"));
                navigate(`${nom}/sections`);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [questionId, navigate, nom, t]);

    const handleUpdate = async () => {
        if (!questionText) {
            toast.error(t("Question text cannot be empty"));
            return;
        }
        try {
            await axiosInstance.put(`/questions/${questionId}`, {
                text: questionText,
                type: questionType
            });
            toast.success(t("Question updated successfully"));
            navigate(`${nom}/quiz/${question.quizId}/edit-quiz`);
        } catch (error) {
            toast.error(t("Failed to update question"));
        }
    };

    if (loading) return <p>{t("Loading...")}</p>;

    return (
        <div className={`max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md ${i18n.language === 'ar' ? 'text-right' : ''}`}>
            <h1 className="text-3xl font-bold mb-6">{t("Edit Question")}</h1>
            {question ? (
                <div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">{t("Question Text")}</label>
                        <input
                            type="text"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            placeholder={t("Enter question text")}
                            className="border p-2 rounded w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">{t("Question Type")}</label>
                        <select
                            value={questionType}
                            onChange={(e) => setQuestionType(e.target.value)}
                            className="border p-2 rounded w-full"
                        >
                            <option value="multiple-choice">{t("Multiple Choice")}</option>
                            <option value="single-choice">{t("Single Choice")}</option>
                            <option value="true-false">{t("True/False")}</option>
                        </select>
                    </div>

                    <button
                        onClick={handleUpdate}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {t("Update Question")}
                    </button>
                </div>
            ) : (
                <p>{t("No question found")}</p>
            )}
        </div>
    );
};

export default EditQuestionPage;
