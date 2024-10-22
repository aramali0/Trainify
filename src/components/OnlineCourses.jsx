import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../helper/axios';
import { useTranslation } from 'react-i18next';

const OnlineCourses = () => {
    const { t } = useTranslation(['home/onlineCourses']);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavoriteCourses = async () => {
            try {
                const response = await axiosInstance.get('/cours/favorites');
                console.log('Fetched courses:', response.data); // Log the fetched courses

                const coursesWithFormateurs = await Promise.all(
                    response.data.map(async (course) => {
                        console.log('Course:', course); // Log each course to see its structure

                        // Check if formateurIds exist and are an array
                        const formateurIds = course.formateurIds || [];
                        if (formateurIds.length === 0) {
                            console.warn(`No formateurIds found for course ${course.id}`);
                        }

                        const formateurNames = await fetchFormateurNames(formateurIds);
                        const loadedImageUrl = await fetchCourseImage(course.imagePath);

                        return { ...course, formateurNames, loadedImageUrl };
                    })
                );

                setCourses(coursesWithFormateurs);
            } catch (error) {
                setError(t('error.fetchCourses'));
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteCourses();
    }, [t]);

    const fetchFormateurNames = async (formateurIds) => {
        try {
            const responses = await Promise.all(
                formateurIds.map(id => axiosInstance.get(`/users/${id}`))
            );

            const names = responses.map(response => `${response.data.firstName} ${response.data.lastName}`);
            console.log('Formateur names:', names); // Log the formateur names
            return names;
        } catch (error) {
            console.error('Failed to fetch formateur names:', error);
            return [t('unknownFormateur')]; // Return 'Unknown' if there's an error
        }
    };

    const fetchCourseImage = async (imagePath) => {
        try {
            if (imagePath) {
                const response = await axiosInstance.get(`http://localhost:8087/api${imagePath}`, { responseType: 'blob' });
                return URL.createObjectURL(response.data);
            } else {
                return "https://via.placeholder.com/400"; // Fallback image
            }
        } catch (error) {
            console.error("Error fetching image:", error);
            return "https://via.placeholder.com/400"; // Fallback image
        }
    };

    if (loading) {
        return <div>{t('loading')}</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <section className="bg-very-light-gray">
            <div className="container">
                <div className="section-heading">
                    <span className="sub-title">{t('discoverNew')}</span>
                    <h2 className="h1 mb-0">{t('ourOnlineCourses')}</h2>
                </div>
                <div className="row g-xxl-5 mt-n2-6">
                    {courses.map((course, index) => (
                        <div className="col-md-6 col-xl-4 mt-2-6" key={index}>
                            <div className="card card-style1 p-0 h-100">
                                <div className={`card-img rounded-0 ${course.isAproved ? 'border-color-secondary' : ''}`}>
                                    <div className="image-hover">
                                        <img
                                            className="rounded-top w-full h-auto max-h-48 object-cover"
                                            src={course.loadedImageUrl}
                                            alt={course.titre}
                                        />
                                    </div>
                                </div>
                                <div className="card-body position-relative pt-0 px-1-9 pb-1-9">
                                    <div className="card-author d-flex items-center space-x-2">
                                        <div className="avatar">
                                            <img
                                                className="rounded-full w-10 h-10 object-cover"
                                                src={course.authorImg || 'default-avatar.jpg'}
                                                alt={course.formateurNames ? course.formateurNames.join(', ') : t('unknownFormateur')}
                                            />
                                        </div>
                                        <h4 className="mb-0 text-base">
                                            {course.formateurNames.length > 0 ? course.formateurNames.join(', ') : t('unknownFormateur')}
                                        </h4>
                                    </div>
                                    <div className="pt-6">
                                        <h3 className="h4 mb-4">
                                            <Link to={`/course-details/${course.id}`}>{course.titre}</Link>
                                        </h3>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="display-30">
                                                <i className="ti-agenda me-2"></i>{course.sessionIds.length || 0} {t('lessons')}
                                            </div>
                                            <div className="display-30">
                                                <i className="ti-user me-2"></i>{course.students || 0} {t('students')}
                                            </div>
                                            <div className="display-30">
                                                <i className="fas fa-star me-1 display-32 text-warning"></i>{course.rating || '0.0(0)'}
                                            </div>
                                        </div>
                                        <div className="dotted-seprator pt-4 mt-4 d-flex justify-content-between align-items-center">
                                            <span className={`badge-soft ${course.isAproved ? 'secondary' : ''}`}>{course.level || t('allLevels')}</span>
                                            <h5 className={`text-${course.isAproved ? 'secondary' : 'primary'} mb-0`}>{course.price || t('free')}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OnlineCourses;
