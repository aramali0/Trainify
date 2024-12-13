import React, { useEffect, useState } from 'react';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { getUser } from '../helper/auth';
import { useNavigate } from 'react-router-dom';
import { FaTasks } from 'react-icons/fa';
import { MdQuestionAnswer } from 'react-icons/md';

const EvaluationListForUserPage = ({ role, nom }) => {
    const [evaluations, setEvaluations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [completedEvaluations, setCompletedEvaluations] = useState([]);
    const [courseNames, setCourseNames] = useState([]);
    const { t } = useTranslation("pages/evaluationForUsersList");
    const userId = getUser().userId;
    const navigate = useNavigate();

useEffect(() => {
    const fetchEvaluations = async () => {
        try {
            const response = await axiosInstance.get(`/evaluations-formation/${userId}/${role}`);
            setEvaluations(response.data);

            // Fetch course names for each evaluation
            const courseNamesResponse = await Promise.all(
                response.data.map(async (evaluation) => {
                    const courseResponse = await axiosInstance.get(`/cours/${evaluation.coursId}`);
                    return { id: evaluation.id, courseName: courseResponse.data.titre};
                })
            );

            setCourseNames(courseNamesResponse);
            
            // Check for completed evaluations
            const completedResponse = await Promise.all(
                response.data.map(evaluation =>
                    axiosInstance.get(`/responses-formation/check/${userId}/${evaluation.id}`)
                )
            );

            const completedIds = completedResponse
                .filter(res => res.data.length > 0)
                .map(res => res.data[0].evaluationId);

            setCompletedEvaluations(completedIds);
        } catch (error) {
            console.error(t('evaluationList.errorFetching'), error);
            toast.error(t('evaluationList.errorLoading'));
        } finally {
            setIsLoading(false);
        }
    };

    fetchEvaluations();
}, [userId, role]);


    return (
        <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-100 to-gray-300 shadow-lg rounded-lg">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center">
                <FaTasks className="mr-3 text-blue-700" />
                {t('evaluationList.title')}
            </h1>
            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="text-lg text-gray-600 animate-pulse">{t('evaluationList.loading')}</div>
                </div>
            ) : evaluations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {evaluations.map((evaluation) => (
                    <div
                        key={evaluation.id}
                        className="p-6 bg-white shadow-md rounded-xl hover:shadow-2xl transition duration-300 transform hover:scale-105 flex flex-col justify-between h-full"
                    >
                        <div>
                            <h2 
                                className="text-lg font-semibold text-gray-800 truncate"
                                style={{ maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                title={evaluation.title} // Tooltip for full title
                            >
                                {evaluation.title}
                            </h2>
                            <p className="text-gray-600 mb-2">
                                <span className="font-medium">{t('evaluationList.course')}:</span>{' '}
                                {courseNames.find((c) => c.id === evaluation.id)?.courseName || t('evaluationList.unknownCourse')}
                            </p>
                            <p className="text-gray-600 mb-4">
                                <span className="font-medium">{t('evaluationList.date')}:</span>{' '}
                                {new Date(evaluation.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            {completedEvaluations.includes(evaluation.id) ? (
                                <button
                                    disabled
                                    className="w-full px-2 py-2 bg-gray-400 text-white font-bold rounded-lg cursor-not-allowed"
                                >
                                    {t('evaluationList.completed')}
                                </button>
                            ) : (
                                <button
                                    onClick={() =>
                                        navigate(`${nom}/evaluation-formations/${evaluation.id}/answer`)
                                    }
                                    className="w-full px-2 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center justify-center transition"
                                >
                                    <MdQuestionAnswer className="mr-2" />
                                    {t('evaluationList.answerQuestions')}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            ) : (
                <div className="text-center text-lg text-gray-600">{t('evaluationList.noEvaluations')}</div>
            )}
        </div>
    );
};

export default EvaluationListForUserPage;