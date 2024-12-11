import React, { useEffect, useState } from 'react';
import HeroSection from '../components/Dashboard/HeroSection';
import DashboardCard from '../components/Dashboard/DashBoardCard';
import ChartCard from '../components/Dashboard/ChartCart';
import Table from '../components/Dashboard/Table';
import Pagination from '../components/Dashboard/Pagination';
import axiosInstance from '../helper/axios';
import { getUser } from '../helper/auth';
import welcomeImage from '../assets/PHOTO1.jpg';
import graduation from '../assets/images/icons/graduat.png';
import grow from '../assets/images/icons/grow.png';
import school from '../assets/images/icons/school.png';
import instructor from '../assets/images/other/instructor-img-5.png';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const Dashboard = ({ path, nom }) => {
    const { t, i18n } = useTranslation('pages/dashboard'); // Initialize translation hook
    const id = getUser().userId;
    const [cours, setCours] = useState([]);
    const [classes, setClasses] = useState([]);
    const [totalInstructors, setTotalInstructors] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalResources, setTotalResources] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [averageScore, setAverageScore] = useState(0);

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    const [studentChartData, setStudentChartData] = useState({
        labels: [],
        datasets: [],
    });

    const [instructorChartData, setInstructorChartData] = useState({
        labels: [],
        datasets: [],
    });

    const [evaluationChartData, setEvaluationChartData] = useState({
        labels: [],
        datasets: [],
    });

    const [combinedChartData, setCombinedChartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        const getResources = async () => {
            try {
                const response = await axiosInstance.get(`/libraries${nom}/${id}/resources`);
                setTotalResources(response.data.length);
            } catch (error) {
                toast.error(t('messages.fetchLibrariesError'));
            }
        };

        const getCours = async () => {
            const response = await axiosInstance.get(`/cours${path}/${id}`);
            setCours(response.data);

            const instructors = new Set();
            response.data.forEach(course => course.formateurIds.forEach(id => instructors.add(id)));
            setTotalInstructors(instructors.size);

            const courseCounts = response.data.reduce((acc, course) => {
                const date = new Date(course.createdAt);
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!acc[key]) {
                    acc[key] = 0;
                }
                acc[key]++;
                return acc;
            }, {});

            const labels = Object.keys(courseCounts).map(key => {
                const [year, month] = key.split('-');
                return `${year}-${month}`;
            });

            const courseData = Object.values(courseCounts);

            setChartData({
                labels,
                datasets: [
                    {
                        label: t('charts.coursesCreated'),
                        data: courseData,
                        fill: false,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                    },
                ],
            });

            return { labels, courseData };
        };

        const getStudents = async () => {
            const response = await axiosInstance.get(`${path}/${id}/participants`);
            setTotalStudents(response.data.length);

            const studentCounts = response.data.reduce((acc, student) => {
                const date = new Date(student.createdAt);
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!acc[key]) {
                    acc[key] = 0;
                }
                acc[key]++;
                return acc;
            }, {});

            const labels = Object.keys(studentCounts).map(key => {
                const [year, month] = key.split('-');
                return `${year}-${month}`;
            });

            const studentData = Object.values(studentCounts);
            setStudentChartData({
                labels,
                datasets: [
                    {
                        label: t('charts.studentsOverTime'),
                        data: studentData,
                        fill: false,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                    },
                ],
            });

            return { labels, studentData };
        };

        const getInstructors = async () => {
            const response = await axiosInstance.get(`${path}/${id}/formateurs`);

            const instructorCounts = response.data.reduce((acc, instructor) => {
                const date = new Date(instructor.createdAt);
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!acc[key]) {
                    acc[key] = 0;
                }
                acc[key]++;
                return acc;
            }, {});

            const labels = Object.keys(instructorCounts).map(key => {
                const [year, month] = key.split('-');
                return `${year}-${month}`;
            });

            const instructorData = Object.values(instructorCounts);
            setInstructorChartData({
                labels,
                datasets: [
                    {
                        label: t('charts.instructorsOverTime'),
                        data: instructorData,
                        fill: false,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                    },
                ],
            });

            return { labels, instructorData };
        };

        const getEvaluations = async () => {
            const response = await axiosInstance.get(`${path}/${id}/evaluations/chart`);

            const evaluationCounts = response.data.reduce((acc, evaluation) => {
                const date = new Date(evaluation.createdAt);
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!acc[key]) {
                    acc[key] = 0;
                }
                acc[key]++;
                return acc;
            }, {});

            const labels = Object.keys(evaluationCounts).map(key => {
                const [year, month] = key.split('-');
                return `${year}-${month}`;
            });

            const evaluationData = Object.values(evaluationCounts);
            setEvaluationChartData({
                labels,
                datasets: [
                    {
                        label: t('charts.evaluationsOverTime'),
                        data: evaluationData,
                        fill: false,
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                    },
                ],
            });

            return { labels, evaluationData };
        };

        const getAverageScore = async () => {
            const response = await axiosInstance.get(`${path}/${id}/average-score`);
            setAverageScore(response.data);
        };

        const fetchAllData = async () => {
            const coursesData = await getCours();
            const studentsData = await getStudents();
            const instructorsData = await getInstructors();
            const evaluationsData = await getEvaluations();

            // Combine the data for the combined chart
            const labels = coursesData.labels; // Assume all charts have the same labels
            setCombinedChartData({
                labels,
                datasets: [
                    {
                        label: t('charts.coursesCreated'),
                        data: coursesData.courseData,
                        fill: false,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                    },
                    {
                        label: t('charts.studentsOverTime'),
                        data: studentsData.studentData,
                        fill: false,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                    },
                    {
                        label: t('charts.instructorsOverTime'),
                        data: instructorsData.instructorData,
                        fill: false,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                    },
                    {
                        label: t('charts.evaluationsOverTime'),
                        data: evaluationsData.evaluationData,
                        fill: false,
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                    },
                ],
            });
        };

        const getClasses = async () => {
            const response = await axiosInstance.get(`${path}/${id}/classes`);
            setClasses(response.data);
        };

            getResources();
            getClasses();
            fetchAllData();
            getAverageScore();
     }, [id, path, nom, t]);

        const totalCourses = cours.length;

        // Pagination logic
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentClasses = classes.slice(indexOfFirstItem, indexOfLastItem);
        const totalPages = Math.ceil(classes.length / itemsPerPage);

        return (
            <div className="space-y-6">
                <HeroSection
                    title={t('dashboard.welcomeBack')}
                    description={t('dashboard.overviewDescription')}
                    buttonText={t('dashboard.viewCourses')}
                    buttonLink={`${nom}/courses`}
                    imageSrc={welcomeImage}
                    nom={nom}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 text-center lg:grid-cols-3 gap-6">
                    <DashboardCard title={t('dashboard.courses')} count={totalCourses} imgSrc={school} link={`${nom}/courses`} />
                    <DashboardCard title={t('dashboard.students')} count={totalStudents} imgSrc={graduation} link={`${nom}/students`} />
                    <DashboardCard title={t('dashboard.instructors')} count={totalInstructors} imgSrc={instructor} link={`${nom}/instructors`} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 text-center lg:grid-cols-3 gap-6">
                    <DashboardCard title={t('dashboard.score')} count={`${averageScore.toFixed(2)}%`} imgSrc={grow} link={`${nom}/latest-evaluations`} />
                    <DashboardCard title={t('dashboard.resources')} count={totalResources} imgSrc={graduation} link={`${nom}/library`} />
                    <DashboardCard title={t('dashboard.resources')} count={totalResources} imgSrc={graduation} link={`${nom}/library`} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                    <ChartCard
                        title={t('charts.combinedActivityChart')}
                        chartData={combinedChartData}
                        subTitle={t('charts.combinedActivity')}
                    />
                    <ChartCard
                        title={t('charts.coursesCreatedByMonth')}
                        chartData={chartData}
                        subTitle={t('charts.nombreCours')}
                    />
                    <ChartCard
                        title={t('charts.studentsOverTime')}
                        chartData={studentChartData}
                        subTitle={t('charts.nombreStudents')}
                    />
                    <ChartCard
                        title={t('charts.instructorsOverTime')}
                        chartData={instructorChartData}
                        subTitle={t('charts.nombreInstructors')}
                    />
                    <ChartCard
                        title={t('charts.evaluationsOverTime')}
                        chartData={evaluationChartData}
                        subTitle={t('charts.nombreEvaluations')}
                    />
                </div>

                <div className="bg-white p-6 rounded-md shadow">
                    <h2 className="text-lg font-semibold mb-4">{t('dashboard.classesDetails')}</h2>
                    <Table data={currentClasses} />
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
            </div>
        );
    };

    export default Dashboard;
