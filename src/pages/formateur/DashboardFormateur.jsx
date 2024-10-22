import React, { useEffect, useState } from 'react';
import HeroSection from '../../components/Dashboard/HeroSection';
import DashboardCard from '../../components/Dashboard/DashBoardCard';
import ChartCard from '../../components/Dashboard/ChartCart';
import Table from '../../components/Dashboard/Table';
import Pagination from '../../components/Dashboard/Pagination';
import axiosInstance from '../../helper/axios';
import { getUser } from '../../helper/auth';
import welcomeImage from '../../assets/images/home/hero-img.png';
import graduation from '../../assets/images/icons/graduat.png';
import grow from '../../assets/images/icons/grow.png';
import school from '../../assets/images/icons/school.png';
import { useTranslation } from 'react-i18next';

const DashboardFormateur = ({ path }) => {
    const id = getUser().userId;
    const [cours, setCours] = useState([]);
    const [classes, setClasses] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [averageScore, setAverageScore] = useState(0);
    const { t, i18n } = useTranslation('pages/dashboardFormateur'); // Using useTranslation hook for translations

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: t('coursesCreated'),
                data: [],
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
        ],
    });

    const [studentChartData, setStudentChartData] = useState({
        labels: [],
        datasets: [
            {
                label: t('studentsEnrolled'),
                data: [],
                fill: false,
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
            },
        ],
    });

    const [evaluationChartData, setEvaluationChartData] = useState({
        labels: [],
        datasets: [
            {
                label: t('evaluationsCompleted'),
                data: [],
                fill: false,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
            },
        ],
    });

    const [combinedChartData, setCombinedChartData] = useState({
        labels: [],
        datasets: [],
    });

    // Fetch Courses
    useEffect(() => {
        const getCours = async () => {
            try {
                const response = await axiosInstance.get(`/cours/formateurs/${id}`);
                setCours(response.data);

                // Prepare data for course chart
                const courseCounts = response.data.reduce((acc, course) => {
                    const date = new Date(course.createdAt);
                    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    if (!acc[key]) acc[key] = 0;
                    acc[key]++;
                    return acc;
                }, {});

                const labels = Object.keys(courseCounts).sort();
                const data = labels.map(key => courseCounts[key]);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: t('coursesCreated'),
                            data,
                            fill: false,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        getCours();
    }, [id, t]);

    // Fetch Students
    useEffect(() => {
        const getStudents = async () => {
            try {
                const response = await axiosInstance.get(`formateurs/${id}/participants`);
                setTotalStudents(response.data.length);

                // Prepare data for student chart
                const studentCounts = response.data.reduce((acc, participant) => {
                    const date = new Date(participant.createdAt);
                    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    if (!acc[key]) acc[key] = 0;
                    acc[key]++;
                    return acc;
                }, {});

                const labels = Object.keys(studentCounts).sort();
                const data = labels.map(key => studentCounts[key]);

                setStudentChartData({
                    labels,
                    datasets: [
                        {
                            label: t('studentsEnrolled'),
                            data,
                            fill: false,
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        getStudents();
    }, [id, t]);

    // Fetch Evaluations
    useEffect(() => {
        const getEvaluations = async () => {
            try {
                const response = await axiosInstance.get(`formateurs/${id}/evaluations/chart`);

                // Prepare data for evaluation chart
                const evaluationCounts = response.data.reduce((acc, evaluation) => {
                    const date = new Date(evaluation.createdAt);
                    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    if (!acc[key]) acc[key] = 0;
                    acc[key]++;
                    return acc;
                }, {});

                const labels = Object.keys(evaluationCounts).sort();
                const data = labels.map(key => evaluationCounts[key]);

                setEvaluationChartData({
                    labels,
                    datasets: [
                        {
                            label: t('evaluationsCompleted'),
                            data,
                            fill: false,
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching evaluations:', error);
            }
        };

        getEvaluations();
    }, [id, t]);

    useEffect(() => {

            const combinedLabels = chartData.labels; // Assuming all have the same labels

            setCombinedChartData({
                labels: combinedLabels,
                datasets: [
                    {
                        label: t('coursesCreated'),
                        data: chartData.datasets[0].data,
                        fill: false,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                    },
                    {
                        label: t('studentsEnrolled'),
                        data: studentChartData.datasets[0].data,
                        fill: false,
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                    },
                    {
                        label: t('evaluationsCompleted'),
                        data: evaluationChartData.datasets[0].data,
                        fill: false,
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                    },
                ],
            });
    }, [chartData, studentChartData, evaluationChartData, t]);

    // Fetch Classes (Assuming you have an API endpoint for classes)
    useEffect(() => {
        const getClasses = async () => {
            try {
                const response = await axiosInstance.get(`/formateurs/${id}/classes`);
                setClasses(response.data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        getClasses();
    }, [id]);

    const totalCourses = cours.length;

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentClasses = classes.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(classes.length / itemsPerPage);

    // Fetch Average Score
    useEffect(() => {
        const getAverageScore = async () => {
            try {
                const response = await axiosInstance.get(`/formateurs/${id}/average-score`);
                setAverageScore(response.data);
            } catch (error) {
                console.error('Error fetching average score:', error);
            }
        };
        getAverageScore();
    }, [id]);

    return (
        <div className="space-y-6">
            <HeroSection
                title={t('welcomeTitle')}
                description={t('welcomeDescription')}
                buttonText={t('viewCourses')}
                buttonLink="/formateur/courses"
                imageSrc={welcomeImage}
                nom='/formateur'
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard title={t('courses')} count={totalCourses} imgSrc={school} link="/formateur/courses" />
                <DashboardCard title={t('students')} count={totalStudents} imgSrc={graduation} link="/formateur/students" />
                <DashboardCard title={t('averageScore')} count={Math.floor(averageScore)} imgSrc={grow} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <ChartCard
                    title={t('combinedChart')}
                    chartData={combinedChartData}
                />
                <ChartCard
                    title={t('coursesOverTime')}
                    chartData={chartData}
                />
                <ChartCard
                    title={t('studentsOverTime')}
                    chartData={studentChartData}
                />
                <ChartCard
                    title={t('evaluationsOverTime')}
                    chartData={evaluationChartData}
                />
            </div>

            {/* Table & Pagination */}
            <div className="bg-white p-6 rounded-md shadow">
                <h2 className="text-lg font-semibold mb-4"> {t('classesDetails')}</h2>
                <Table data={currentClasses} />
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
};

export default DashboardFormateur;
