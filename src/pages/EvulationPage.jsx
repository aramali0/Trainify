import React, { useEffect, useState } from 'react';
import axiosInstance from '../helper/axios';
import { getUser } from '../helper/auth';
import { AiFillDelete, AiOutlineDownload } from 'react-icons/ai'; // Icons for delete and download
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const EvaluationPage = ({ path, nom }) => {
    const { t, i18n } = useTranslation('pages/evaluationPage');  // Multi-language translation hook
    const [evaluations, setEvaluations] = useState([]);
    const [users, setUsers] = useState({});
    const [sections, setSections] = useState([]);  // Holds sections
    const [quizzes, setQuizzes] = useState([]);   // Holds quizzes
    const [selectedSectionId, setSelectedSectionId] = useState(''); // Selected section ID
    const [selectedQuizId, setSelectedQuizId] = useState('');  // Selected quiz ID
    const [currentPage, setCurrentPage] = useState(0);  // Pagination
    const [totalPages, setTotalPages] = useState(1);   // Total pages
    const [loading, setLoading] = useState(false);    // Loading spinner
    const [entreprise, setEntreprise] = useState(null);  // Enterprise data
    const responsableId = getUser().userId;  // User ID from context

    useEffect(() => {
        document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';  // Set body direction for RTL support
    }, [i18n.language]);

    const fetchUser = async (userId) => {
        if (!users[userId]) {
            try {
                const response = await axiosInstance.get(`/users/${userId}`);
                setUsers(prev => ({ ...prev, [userId]: response.data }));
            } catch (error) {
                console.error(`Error fetching user ${userId}:`, error);
            }
        }
    };

    const fetchSections = async () => {
        try {
            const response = await axiosInstance.get(`${path}/${responsableId}/sections`);
            setSections(response.data);
        } catch (error) {
            console.error('Error fetching sections:', error);
        }
    };

    const fetchQuizzes = async () => {
        try {
            const response = await axiosInstance.get(`/quizzes`);
            setQuizzes(response.data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };

    const fetchEvaluations = async (page = 0, sectionId = '', quizId = '') => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${path}/${responsableId}/evaluations`, {
                params: {
                    page,
                    size: 10,
                    sectionId: sectionId || null,
                    quizId: quizId || null,
                },
            });
            console.log("response from the fetchEvaluations : ",response?.data);
            if(response?.data?._embedded?.evaluationDtoList?.length > 0){
            setEvaluations(response.data._embedded.evaluationDtoList);
            }
            else
            {
                setEvaluations([]);
            }
            setTotalPages(response.data.totalPages);
            response.data?._embedded?.evaluationDtoList?.forEach(evaluation => fetchUser(evaluation.participantId));
        } catch (error) {
            console.error('Error fetching evaluations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEntreprise = async () => {
        try {
            const response = await axiosInstance.get(`${path}/${responsableId}/entreprise`);
            setEntreprise(response.data);
        } catch (error) {
            console.error('Error fetching entreprise data:', error);
        }
    };

    useEffect(() => {
        fetchSections();
        fetchQuizzes();
        fetchEntreprise();
    }, [responsableId]);

    useEffect(() => {
        fetchEvaluations(currentPage, selectedSectionId, selectedQuizId);
    }, [currentPage, selectedSectionId, selectedQuizId, responsableId]);

    const handleSectionChange = (e) => {
        setSelectedSectionId(e.target.value);
        setCurrentPage(0);  // Reset to the first page
    };

    const handleQuizChange = (e) => {
        setSelectedQuizId(e.target.value);
        setCurrentPage(0);  // Reset to the first page
    };

    const deleteEvaluation = async (evaluationId) => {
        try {
            const response = await axiosInstance.delete(`/evaluations/${evaluationId}`);
            fetchEvaluations(currentPage, selectedSectionId, selectedQuizId);  // Refresh after deletion
        } catch (error) {
            console.error('Error deleting evaluation:', error);
        }
    };

    const downloadPdf = async (evaluationId) => {
        try {
            const response = await axiosInstance.get(`/evaluations/${evaluationId}/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `evaluation_${evaluationId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }
    };

    const handleNextPage = () => currentPage < totalPages - 1 && setCurrentPage(prev => prev + 1);
    const handlePrevPage = () => currentPage > 0 && setCurrentPage(prev => prev - 1);

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">{t('title')}</h1>

            {/* Section Filter */}
            <div className="mb-4">
                <label htmlFor="sectionFilter" className="block mb-2">{t('filterBySection')}:</label>
                <select
                    id="sectionFilter"
                    value={selectedSectionId}
                    onChange={handleSectionChange}
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    <option value="">{t('selectSection')}</option>
                    {sections.map((section) => (
                        <option key={section.id} value={section.id}>
                            {section.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Quiz Filter */}
            <div className="mb-4">
                <label htmlFor="quizFilter" className="block mb-2">{t('filterByQuiz')}:</label>
                <select
                    id="quizFilter"
                    value={selectedQuizId}
                    onChange={handleQuizChange}
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    <option value="">{t('selectQuiz')}</option>
                    {quizzes.map((quiz) => (
                        <option key={quiz.id} value={quiz.id}>
                            {quiz.title} - {quiz.type}
                        </option>
                    ))}
                </select>
            </div>

            {/* Evaluations */}
            {loading ? (
                <p className="text-center text-gray-600">{t('loading')}</p>
            ) : evaluations?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {evaluations.map((evaluation) => (
                        <div key={evaluation.id} className="bg-white p-5 rounded-lg shadow-md relative">
                            <h2 className="text-xl font-semibold text-blue-600 mb-2">{evaluation.type}</h2>
                            
                            {entreprise?.showQuizResult && (
                                <p className="text-gray-700 mb-2"><strong>{t('score')}:</strong> {evaluation.score}%</p>
                            )}

                            <p className="text-gray-700 mb-2"><strong>{t('date')}:</strong> {new Date(evaluation.createdAt).toLocaleDateString()}</p>
                            <p className="text-gray-700 mb-2"><strong>{t('time')}:</strong> {evaluation.timeTaken}s</p>
                            <p className="text-gray-700 mb-2">
                                <strong>{t('participant')}:</strong> {`${users[evaluation.participantId]?.firstName || ''} ${users[evaluation.participantId]?.lastName || ''}` || t('loading')}
                            </p>

                            <button className="absolute top-2 right-2 text-red-500" onClick={() => deleteEvaluation(evaluation.id)}>
                                <AiFillDelete size={24} />
                            </button>

                            {entreprise?.showQuizCorrection && (
                                <>
                                    <button className="absolute bottom-2 right-2 text-blue-500" onClick={() => downloadPdf(evaluation.id)}>
                                        <AiOutlineDownload size={24} />
                                    </button>

                                    <Link className="absolute bottom-2 left-2 text-blue-500" to={`${nom}/evaluation/${evaluation.id}/questions`}>
                                        {t('correction')}
                                    </Link>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">{t('noEvaluations')}</p>
            )}

            {/* Pagination */}
            <div className="flex justify-center space-x-4 mt-8">
                <button
                    className={`p-2 rounded ${currentPage === 0 ? 'bg-gray-300' : 'bg-blue-600 text-white'}`}
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                >
                    {t('previous')}
                </button>
                <button
                    className={`p-2 rounded ${currentPage >= totalPages - 1 ? 'bg-gray-300' : 'bg-blue-600 text-white'}`}
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages - 1}
                >
                    {t('next')}
                </button>
            </div>
        </div>
    );
};

export default EvaluationPage;

