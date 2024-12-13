import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { getUser } from '../helper/auth';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList, FaEye, FaPlus, FaUserAlt } from 'react-icons/fa';
import { format } from 'date-fns';

const EvaluationListPage = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userMap, setUserMap] = useState({});
    const navigate = useNavigate();
    const { t } = useTranslation("pages/evaluationList");
    const userId = getUser().userId;

    useEffect(() => {
        const fetchCoursesAndEvaluations = async () => {
            try {
                const coursesResponse = await axiosInstance.get(`/cours/responsables/${userId}`);
                const courseOptions = coursesResponse.data.map(course => ({
                    value: course.id,
                    label: course.titre
                }));
                setCourses(courseOptions);
            } catch (error) {
                console.error(t('error.fetchingData'), error);
                toast.error(t('error.failedToLoadData'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchCoursesAndEvaluations();
    }, [userId]);

    useEffect(() => {
        fetchEvaluations();
    }, [selectedCourse]);

    const fetchEvaluations = async () => {
        try {
            const params = selectedCourse ? `?coursId=${selectedCourse.value}` : '';
            const response = await axiosInstance.get(`/evaluations-formation/responsable/${userId}${params}`);
            const evaluationsData = response.data;

            // Fetch user details for each evaluation
            const userIds = [...new Set(evaluationsData.map(ev => ev.createdBy))];
            const userPromises = userIds.map(id => axiosInstance.get(`/users/${id}`));
            const userResponses = await Promise.all(userPromises);

            const userMapping = userResponses.reduce((map, response) => {
                map[response.data.userId] = `${response.data.firstName} ${response.data.lastName}`;
                return map;
            }, {});

            setUserMap(userMapping);
            setEvaluations(evaluationsData);
        } catch (error) {
            console.error(t('error.fetchingData'), error);
            toast.error(t('error.failedToLoadData'));
        } finally {
            setIsLoading(false);
        }
    };

    const filteredEvaluations = selectedCourse
        ? evaluations.filter(evaluation => evaluation.coursId === selectedCourse.value)
        : evaluations;

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gradient-to-r from-gray-100 to-gray-200">
            <div className='flex justify-between items-center'>
                <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
                    {t('evaluationList.title')}
                </h1>
                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => navigate('/responsable/evaluation-formations/create')}
                        className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold text-lg rounded-lg hover:bg-green-700 transition"
                    >
                        <FaPlus className="mr-2" />
                        {t('evaluationList.createEvaluation')}
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                    {t('evaluationList.filterByCourse')}
                </label>
                <Select
                    options={courses}
                    value={selectedCourse}
                    onChange={setSelectedCourse}
                    placeholder={t('evaluationList.selectCoursePlaceholder')}
                    isClearable
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center text-xl text-gray-600">
                    {t('common.loading')}...
                </div>
            ) : filteredEvaluations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvaluations.map(evaluation => (
                    <div
                        key={evaluation.id}
                        className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition duration-300 flex flex-col justify-between"
                        style={{ minHeight: '200px' }} // Ensure a consistent height for all cards
                    >
                        <div>
                            <div className="flex items-center mb-4">
                                <FaClipboardList className="text-blue-600 text-3xl mr-4" />
                                <h2
                                    className="text-lg font-semibold text-gray-800 truncate"
                                    style={{ maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                    title={evaluation.title} // Tooltip for full title
                                >
                                    {evaluation.title}
                                </h2>
                            </div>
                            <p className="text-gray-600 mb-2">
                                {t('evaluationList.type')}: {evaluation.type}
                            </p>
                            <p className="text-gray-600 mb-2 flex items-center">
                                <FaUserAlt className="text-gray-500 mr-2" />
                                {userMap[evaluation.createdBy] || t('common.unknownUser')}
                            </p>
                            <p className="text-gray-600">
                                {t('evaluationList.date')}: {format(new Date(evaluation.createdAt), 'dd MMM yyyy')}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate(`/responsable/evaluation-formations/${evaluation.id}`)}
                            className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <FaEye className="mr-2" />
                            {t('evaluationList.viewResponses')}
                        </button>
                    </div>

                    ))}
                </div>
            ) : (
                <div className="text-center text-xl text-gray-600">
                    {t('evaluationList.noEvaluations')}
                </div>
            )}
        </div>
    );
};

export default EvaluationListPage;
