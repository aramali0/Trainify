// src/components/CourseCard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { IoIosSend } from "react-icons/io";
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../helper/axios';

const CourseCard = ({ nom, handleSend2ResponsableFormation, isChargeFormation, course, isAdmin }) => {
    const [loadedImageUrl, setLoadedImageUrl] = useState(null);
    const [isFavorite, setIsFavorite] = useState(course?.isFavorite);
    const navigate = useNavigate();
    const { t } = useTranslation('pages/courseCard');

    useEffect(() => {
        const fetchImageWithAuth = async () => {
            try {
                if (course.imagePath) {
                    const response = await axiosInstance.get(`http://localhost:8087/api${course.imagePath}`, { responseType: 'blob' });
                    setLoadedImageUrl(URL.createObjectURL(response.data));
                } else {
                    setLoadedImageUrl("https://via.placeholder.com/400");
                }
            } catch (error) {
                console.error("Error fetching image:", error);
                setLoadedImageUrl("https://via.placeholder.com/400");
            }
        };

        fetchImageWithAuth();
    }, [course.imagePath]);

    const handleFavoriteClick = async () => {
        try {
            await axiosInstance.post(`/cours/favorites/${course.id}`);
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Error updating favorite status:", error);
            // Optionally, you can add a toast notification here
        }
    };

    const handleShowSessionsClick = () => navigate(`${nom}/courses/${course.id}/sessions`);
    const handleShowLibraryClick = () => navigate(`${nom}/courses/${course.id}/library`);
    const handleUpdateClick = () => navigate(`${nom}/courses/update/${course.id}`);

    return (
        <motion.div
            className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer sm:w-full md:w-[280px] max-xl:w-80 mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative">
                <img
                    src={loadedImageUrl || "https://via.placeholder.com/400"}
                    alt={t("course.altImage")}
                    className="w-full h-48 object-cover sm:h-40 md:h-48"
                    onError={(e) => e.target.src = "https://via.placeholder.com/400"}
                />
                {isAdmin && (
                    <button
                        className={`absolute top-2 right-2 text-2xl ${isFavorite ? "text-red-500" : "text-gray-500"} hover:text-red-600 transition-colors`}
                        onClick={handleFavoriteClick}
                        aria-label={isFavorite ? t("buttons.unfavorite") : t("buttons.favorite")}
                    >
                        <i className={`fa${isFavorite ? 's' : 'r'} fa-heart`}></i>
                    </button>
                )}
                {isChargeFormation && !course?.isApproved && (
                    <button
                        className={`absolute top-2 right-2 text-2xl text-red-600 transition-colors`}
                        onClick={() => handleSend2ResponsableFormation(course.id)}
                        aria-label={t("buttons.sendRequest")}
                    >
                        <IoIosSend className="text-red-500 bg-red-200 p-1 text-3xl rounded-full" />
                    </button>
                )}

                {(nom === "/responsable" || nom === "/admin" || isChargeFormation) && (
                    <button
                        className="absolute top-2 left-2 text-xl text-gray-500 hover:text-blue-600 transition-colors"
                        onClick={handleUpdateClick}
                        title={t("buttons.updateCourse")}
                        aria-label={t("buttons.updateCourse")}
                    >
                        <i className="fas fa-edit"></i>
                    </button>
                )}
            </div>
            <div className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 truncate" style={{ maxHeight: '2.5rem' }}>
                    {course.titre}
                </h2>
                <p className="text-gray-600 text-sm md:text-base mb-4 truncate" style={{ maxHeight: '4rem' }}>
                    {course.subTitre}
                </p>
                <div className="border-t border-gray-200 pt-4 mt-4">
                    <p className="text-gray-700 text-sm md:text-base mb-1">
                        <strong>{t("course.sessions")}:</strong> {course.sessionIds.length}
                    </p>
                    <p className="text-gray-700 text-sm md:text-base mb-1">
                        <strong>{t("course.duration")}:</strong> {course.duree} {t("course.hours")}
                    </p>
                    <p className="text-gray-700 text-sm md:text-base mb-1">
                        <strong>{t("course.language")}:</strong> {course.langue}
                    </p>
                    <p className="text-gray-700 text-sm md:text-base mb-1">
                        <strong>{t("course.createdAt")}:</strong> {new Date(course.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 text-sm md:text-base mb-1">
                        <strong>{t("course.lastUpdated")}:</strong> {new Date(course.miseAJour).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex justify-between items-center space-x-4 mt-4 flex-wrap">
                    <span
                        onClick={handleShowSessionsClick}
                        className="text-blue-600 text-xs md:text-sm cursor-pointer hover:underline"
                    >
                        {t("buttons.showSessions")}
                    </span>
                    {!isAdmin && (
                        <span
                            onClick={handleShowLibraryClick}
                            className="text-blue-600 text-xs md:text-sm cursor-pointer hover:underline"
                        >
                            {t("buttons.showLibrary")}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default CourseCard;
