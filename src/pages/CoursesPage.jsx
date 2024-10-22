import React, { useState, useEffect } from 'react';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { getUser } from '../helper/auth';
import { useTranslation } from 'react-i18next';

const CoursesPage = ({ nom, path }) => {
    const { courseId } = useParams();
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const userId = getUser().userId;
    const navigate = useNavigate();
    const isAdmin = nom === "/admin";  // Check if the user is an admin
    const isChargeFormation = nom === "/charge-formation";  // Check if the user is charge formation

    const { t, i18n } = useTranslation('pages/courses');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                if (courseId != null) {
                    const response = await axiosInstance.get(`/cours/${courseId}`);
                    setCourses([response.data]);
                } else {
                    const response = nom === "/admin"
                        ? await axiosInstance.get(`/cours`)
                        : await axiosInstance.get(`/cours${path}/${userId}`);
                    setCourses(response.data);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
                toast.error(t("errors.failedToLoadCourses"));
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [nom, path, userId, t, courseId]);

    const handleCreateCourse = () => navigate(`${nom}/courses/add`);

    const handleSend2ResponsableFormation = async (id) => {
        try {
            await axiosInstance.post(`/cours/sendRequest/${id}`);
            setCourses(courses.filter(course => course.id !== id));
            toast.success(t("messages.requestSentSuccessfully"));
        } catch (error) {
            console.error("Error updating favorite status:", error);
            if (error.response) {
                toast.error(error.response.data);
            } else {
                toast.error(t("errors.errorSendingRequest"));
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-100">
            <div className='flex justify-between mb-4'>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6">{t("titles.courses")}</h1>
                {(nom === "/responsable" || nom === "/admin" || nom === "/charge-formation") && (
                    <button
                        onClick={handleCreateCourse}
                        className="mb-6 px-3 py-1 md:px-5 md:py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {t("buttons.createCourse")}
                    </button>
                )}
            </div>
            {isLoading ? (
                <div>{t("messages.loading")}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {courses.map(course => (
                        <CourseCard
                            nom={nom}
                            handleSend2ResponsableFormation={handleSend2ResponsableFormation}
                            key={course.id}
                            isChargeFormation={isChargeFormation}
                            course={course}
                            isAdmin={isAdmin}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CoursesPage;
