import React, { useState } from 'react';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getUser } from '../helper/auth';
import { FaPlus, FaTrash, FaFileAlt } from 'react-icons/fa';

const CreateEvaluationPage = () => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('PARTICIPANT');
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const { t } = useTranslation("pages/createEvalutionFormation");
    const navigate = useNavigate();
    const userId = getUser().userId;

    const handleAddQuestion = () => {
        if (newQuestion.trim()) {
            setQuestions([...questions, newQuestion]);
            setNewQuestion('');
        } else {
            toast.error(t('createEvaluation.enterQuestion'));
        }
    };

    const handleRemoveQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!title.trim() || questions.length === 0) {
            toast.error(t('createEvaluation.fillAllFields'));
            return;
        }

        try {
            const payload = {
                title,
                type,
                questions,
                createdBy: userId,
            };
            const response = await axiosInstance.post('/evaluations-formation', payload);
            console.log("Evaluation created:", response.data);
            toast.success(t('createEvaluation.successMessage'));
            navigate('/responsable/evaluation-formations');
        } catch (error) {
            console.error(t('createEvaluation.errorCreating'), error);
            toast.error(t('createEvaluation.failMessage'));
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-gray-100 to-gray-200">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-8 text-center">
                {t('createEvaluation.title')}
            </h1>
            <div className="bg-white p-6 shadow-lg rounded-lg">
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        {t('createEvaluation.titleLabel')}
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={t('createEvaluation.titlePlaceholder')}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        {t('createEvaluation.typeLabel')}
                    </label>
                    <select
                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="PARTICIPANT">{t('createEvaluation.participant')}</option>
                        <option value="FORMATEUR">{t('createEvaluation.formateur')}</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        {t('createEvaluation.questionsLabel')}
                    </label>
                    <div className="flex mb-4">
                        <input
                            type="text"
                            className="flex-1 px-4 py-2 border rounded focus:ring focus:ring-green-300"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder={t('createEvaluation.questionPlaceholder')}
                        />
                        <button
                            onClick={handleAddQuestion}
                            className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                        >
                            <FaPlus className="mr-2" />
                            {t('createEvaluation.addQuestion')}
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {questions.map((question, index) => (
                            <li
                                key={index}
                                className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm"
                            >
                                <span>{question}</span>
                                <button
                                    onClick={() => handleRemoveQuestion(index)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <FaTrash />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <button
                    onClick={handleSubmit}
                    className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                >
                    {t('createEvaluation.submit')}
                </button>
            </div>
        </div>
    );
};

export default CreateEvaluationPage;
