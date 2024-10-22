// src/pages/SectionsPage.js
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { getUser } from '../helper/auth';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import QuizModal from '../components/QuizModal';
import { useTranslation } from 'react-i18next';

const SectionsPage = ({ path, nom }) => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quizzes, setQuizzes] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const { sessionId } = useParams();
    const userId = getUser().userId;
    const { t } = useTranslation('pages/sectionPage'); // Specify the namespace

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = sessionId
                    ? await axiosInstance.get(`/sessions/${sessionId}/sections`)
                    : await axiosInstance.get(`${path}/${userId}/sections`);
                setSections(response.data);
            } catch (error) {
                toast.error(t("errors.failedToLoadSections"));
            } finally {
                setLoading(false);
            }
        };

        fetchSections();
    }, [sessionId, userId, path, t]);

    const handleViewQuizzes = async (sectionId) => {
        try {
            const response = await axiosInstance.get(`/quizzes/section/${sectionId}`);
            setQuizzes(response.data);
            setSelectedSectionId(sectionId);
            setModalOpen(true); // Open the modal after fetching quizzes
        } catch (error) {
            toast.error(t("errors.failedToLoadQuizzes"));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t("messages.confirmDeleteSection"))) {
            try {
                await axiosInstance.delete(`/sections/${id}`);
                setSections(sections.filter(section => section.id !== id));
                toast.success(t("messages.sectionDeletedSuccessfully"));
            } catch (error) {
                if (error.response?.data) {
                    toast.error(error.response.data);
                } else {
                    toast.error(t("errors.failedToDeleteSection"));
                }
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{t("titles.sections")}</h1>
                {(nom === "/responsable" || nom === "/charge-formation") && (
                    <Link
                        to={`${nom}/sections/add`}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 text-sm font-medium"
                    >
                        {t("buttons.addNewSection")}
                    </Link>
                )}
            </div>

            {loading ? (
                <p className="text-gray-600">{t("messages.loadingSections")}</p>
            ) : sections.length === 0 ? (
                <p className="text-gray-600">{t("messages.noSectionsAvailable")}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map(section => (
                        <div 
                            key={section.id} 
                            className="bg-white p-4 rounded-lg shadow-md border border-gray-200 relative flex flex-col h-64"
                        >
                            {(nom === "/responsable" || nom === "/charge-formation") && (
                                <div className="absolute top-2 right-2 flex space-x-2">
                                    <Link to={`${nom}/sections/edit/${section.id}`} className="text-blue-500 hover:text-blue-700" aria-label={t("aria.editSection")}>
                                        <FaEdit className="w-5 h-5" />
                                    </Link>
                                    <button onClick={() => handleDelete(section.id)} className="text-red-500 hover:text-red-700" aria-label={t("aria.deleteSection")}>
                                        <FaTrashAlt className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                                {section.title}
                            </h2>
                            <p className="text-gray-600 flex-grow overflow-hidden text-ellipsis">
                                {section.content ? `${section.content.slice(0, 100)}...` : t("messages.noDescriptionAvailable")}
                            </p>
                            <div className="text-sm text-gray-500 mt-2">
                                <p><strong>{t("labels.startDate")}:</strong> {new Date(section.startDate).toLocaleDateString()}</p>
                                <p><strong>{t("labels.endDate")}:</strong> {new Date(section.endDate).toLocaleDateString()}</p>
                            </div>
                            <div className="mt-4">
                                {nom === "/participant" && section.quizIds.length > 0 && (
                                    <button
                                        onClick={() => handleViewQuizzes(section.id)}
                                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 text-sm font-medium"
                                    >
                                        {t("buttons.startQuiz")}
                                    </button>
                                )}
                                {nom !== "/participant" && nom !== "/admin" && (
                                    <div className="mt-4 flex justify-between space-x-4">
                                        <button
                                            onClick={() => handleViewQuizzes(section.id)}
                                            className="px-2 py-1 text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition duration-200 text-sm font-medium"
                                        >
                                            {t("buttons.viewQuiz")}
                                        </button>
                                        <Link
                                            to={`${nom}/sections/${section.id}/create-quiz`}
                                            className="px-2 py-1 text-yellow-600 border border-yellow-600 rounded-md hover:bg-yellow-50 transition duration-200 text-sm font-medium"
                                        >
                                            {t("buttons.createQuiz")}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Render the QuizModal and pass the necessary props */}
            <QuizModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                quizzes={quizzes}
                sectionId={selectedSectionId}
                nom={nom}
            />
        </div>
    );
};

export default SectionsPage;
