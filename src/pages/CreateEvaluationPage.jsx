import React, { useState, useEffect } from 'react';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getUser } from '../helper/auth';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Slider from '@mui/material/Slider';

const CreateEvaluationPage = () => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('PARTICIPANT');
    const [blocks, setBlocks] = useState([]);
    const [newBlock, setNewBlock] = useState({ title: '', weightage: 0, questions: [] });
    const [newQuestion, setNewQuestion] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const { t } = useTranslation("pages/createEvalutionFormation");
    const navigate = useNavigate();
    const userId = getUser().userId;

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axiosInstance.get(`/cours/responsables/${userId}`);
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
                toast.error(t('createEvaluation.errorFetchingCourses'));
            }
        };
        fetchCourses();
    }, [userId, t]);

    const handleAddBlock = () => {
        const totalWeightage = blocks.reduce((sum, block) => sum + block.weightage, 0) + newBlock.weightage;

        if (totalWeightage > 100) {
            toast.error(t('createEvaluation.totalWeightageError'));
            return;
        }

        if (newBlock.title.trim() && newBlock.weightage >= 0 && newBlock.questions.length > 0) {
            setBlocks([...blocks, { ...newBlock, id: blocks.length + 1 }]);
            setNewBlock({ title: '', weightage: 0, questions: [] });
        } else {
            toast.error(t('createEvaluation.enterBlockDetails'));
        }
    };

    const handleRemoveBlock = (index) => {
        setBlocks(blocks.filter((_, i) => i !== index));
    };

    const handleAddQuestionToBlock = () => {
        if (newQuestion.trim()) {
            setNewBlock({ ...newBlock, questions: [...newBlock.questions, newQuestion] });
            setNewQuestion('');
        } else {
            toast.error(t('createEvaluation.enterQuestion'));
        }
    };

    const handleRemoveQuestionFromBlock = (index) => {
        setNewBlock({ ...newBlock, questions: newBlock.questions.filter((_, i) => i !== index) });
    };

    const handleSubmit = async () => {
        const totalWeightage = blocks.reduce((sum, block) => sum + block.weightage, 0);
        if (totalWeightage !== 100) {
            toast.error(t('createEvaluation.totalWeightageError'));
            return;
        }

        if (!title.trim() || blocks.length === 0 || !selectedCourseId) {
            toast.error(t('createEvaluation.fillAllFields'));
            return;
        }

        try {
            const payload = {
                title,
                type,
                blocks: blocks?.map(block => ({
                    title: block.title,
                    weightage: block.weightage,
                    questions: block.questions
                })),
                createdBy: userId,
                coursId: selectedCourseId,
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
                        {t('createEvaluation.courseLabel')}
                    </label>
                    <select
                        className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
                        value={selectedCourseId || ''}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                    >
                        {courses?.map(course => (
                            <option key={course.id} value={course.id}>{course.titre}</option>
                        ))}
                    </select>
                </div>

            <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        {t('createEvaluation.blocksLabel')}
                    </label>
                    <div className="mb-4">
                        <input
                            type="text"
                            className="w-full mb-2 px-4 py-2 border rounded focus:ring focus:ring-green-300"
                            value={newBlock.title}
                            onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
                            placeholder={t('createEvaluation.blockTitlePlaceholder')}
                        />
                        <Slider
                            value={newBlock.weightage}
                            onChange={(e, value) => setNewBlock({ ...newBlock, weightage: value })}
                            step={1}
                            min={0}
                            max={100}
                            valueLabelDisplay="on"
                        />
                        <div className="flex mb-2">
                            <input
                                type="text"
                                className="flex-1 px-4 py-2 border rounded focus:ring focus:ring-green-300"
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                placeholder={t('createEvaluation.questionPlaceholder')}
                            />
                            <button
                                onClick={handleAddQuestionToBlock}
                                className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                            >
                                <FaPlus className="mr-2" />
                                {t('createEvaluation.addQuestion')}
                            </button>
                        </div>
                        <ul className="space-y-2">
                            {newBlock.questions.map((question, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm"
                                >
                                    <span>{question}</span>
                                    <button
                                        onClick={() => handleRemoveQuestionFromBlock(index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <FaTrash />
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={handleAddBlock}
                            className="w-full mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                        >
                            {t('createEvaluation.addBlock')}
                        </button>
                    </div>

                    <ul className="space-y-4">
                        {blocks.map((block, index) => (
                            <li
                                key={index}
                                className="p-4 bg-gray-200 rounded-lg shadow-md"
                            >
                                <div className="flex justify-between">
                                    <h3 className="font-bold">{block.title} ({block.weightage}%)</h3>
                                    <button
                                        onClick={() => handleRemoveBlock(index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                                <ul className="mt-2 space-y-1">
                                    {block.questions.map((question, qIndex) => (
                                        <li key={qIndex} className="text-sm">- {question}</li>
                                    ))}
                                </ul>
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
