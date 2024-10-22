import React, { useState, useEffect } from 'react';
import axiosInstance from '../helper/axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaFilter, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../helper/auth';
import { useTranslation } from 'react-i18next';

// Translation JSON

const ClassPage = ({ nom, path, language }) => {
    const [classes, setClasses] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const responsableId = getUser().userId;
    const navigate = useNavigate();
    const {t} = useTranslation('pages/classPage');
    const translate = (key) => t(key);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axiosInstance.get(`${path}/${responsableId}/classes`);
                setClasses(response.data);
            } catch (error) {
                toast.error(translate('failedToFetchClasses', language));
            }
        };

        const fetchCourses = async () => {
            try {
                const response = await axiosInstance.get(`/cours${path}/${responsableId}`);
                setCourses(response.data);
            } catch (error) {
                toast.error(translate('failedToFetchCourses', language));
            }
        };

        fetchClasses();
        fetchCourses();
    }, [path, responsableId]);

    const handleFilterByCourse = async (courseId) => {
        try {
            const response = await axiosInstance.get(`/classes/cour/${courseId}`);
            setClasses(response.data);
            setSelectedCourse(courseId);
        } catch (error) {
            toast.error(translate('failedToFilterClasses', language));
        }
    };

    const handleDeleteClass = async (id) => {
        try {
            await axiosInstance.delete(`/classes/${id}`);
            toast.success(translate('classDeletedSuccess', language));
            setClasses(classes.filter(cls => cls.id !== id));
        } catch (error) {
            if (error.response?.data) {
                toast.error(error.response.data);
            } else {
                toast.error(translate('failedToDeleteClass', language));
            }
        }
    };

    return (
        <div className={`p-4 md:p-6 bg-gray-100 ${language === 'ar' ? 'rtl' : ''}`}>
            <ToastContainer />
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">{translate('title', language)}</h1>

            <div className="flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0">
                <select
                    value={selectedCourse}
                    onChange={(e) => handleFilterByCourse(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full md:w-auto"
                >
                    <option value="">{translate('filterByCourse', language)}</option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.titre}
                        </option>
                    ))}
                </select>

                {nom !== "/participant" && (
                    <button
                        onClick={() => navigate(`${nom}/create-class`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center w-full md:w-auto"
                    >
                        <FaPlus className="mr-2" />
                        {translate('createClass', language)}
                    </button>
                )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <ul className="space-y-4">
                    {classes.map((cls) => (
                        <li key={cls.id} className="border-b last:border-b-0 pb-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-medium text-gray-800">{cls.titre}</span>
                                {nom !== "/participant" && (
                                    <div className="flex items-center space-x-2 md:space-x-4">
                                        <FaEdit
                                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                            onClick={() => navigate(`${nom}/edit-class/${cls.id}`)}
                                        />
                                        <FaTrash
                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                            onClick={() => handleDeleteClass(cls.id)}
                                        />
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ClassPage;
