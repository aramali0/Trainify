import React, { useEffect, useState } from 'react';
import HeroSection from '../components/Dashboard/HeroSection';
import CoursesCard from '../components/Dashboard/CoursesCard';
import axiosInstance from '../helper/axios';
import { getUser } from '../helper/auth';
import EvaluationChart from '../components/EvaluationChart';
import { useTranslation } from 'react-i18next'; // For translation
import welcomeImage from '../assets/PHOTO1.jpg';
import graduation from '../assets/images/icons/graduat.png';
import school from '../assets/images/icons/school.png';
import award from '../assets/images/icons/award.png';
import grow from '../assets/images/icons/grow.png';
import DashboardCard from '../components/Dashboard/DashBoardCard';

const DashboardParticipant = () => {
    const id = getUser().userId;
    const { t, i18n } = useTranslation('pages/participantDashboard'); // Translation hook

    const [cours, setCours] = useState([]);
    const [totalResources, setTotalResources] = useState(0);
    const [maxScore, setMaxScore] = useState(0);
    const [totalCertificate, setTotalCertificate] = useState(0);

    // Detect RTL for Arabic language
    useEffect(() => {
        const html = document.documentElement;
        if (i18n.language === 'ar') {
            html.setAttribute('dir', 'rtl');
        } else {
            html.setAttribute('dir', 'ltr');
        }
    }, [i18n.language]);

    useEffect(() => {
        const fetchTotalCertificates = async () => {
            const response = await axiosInstance.get(`/participants/${id}/certificates/count`);
            setTotalCertificate(response.data);
        };

        fetchTotalCertificates();
    }, []);

    useEffect(() => {
        const getCours = async () => {
            const response = await axiosInstance.get(`/cours/participants/${id}`);
            setCours(response.data);
        };

        const getResources = async () => {
            const response = await axiosInstance.get(`/participants/${id}/resources`);
            setTotalResources(response.data.length);
        };

        const getMaxScore = async () => {
            const response = await axiosInstance.get(`/participants/${id}/max-evaluation-score`);
            setMaxScore(response.data);
        };

        getCours();
        getResources();
        getMaxScore();
    }, [id]);

    const totalCourses = cours.length;

    return (
        <div className="space-y-6">
            <HeroSection
                title={t('dashboard.welcomeTitle')}
                description={t('dashboard.welcomeDescription')}
                buttonText={t('dashboard.viewCoursesButton')}
                buttonLink="/participant/courses"
                imageSrc={welcomeImage}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard title={t('dashboard.courses')} count={totalCourses} imgSrc={school} link="/participant/courses" />
                <DashboardCard title={t('dashboard.resources')} count={totalResources} imgSrc={graduation} link="/participant/resources" />
                <DashboardCard title={t('dashboard.certificates')} count={totalCertificate} imgSrc={award} link="/participant/certificates" />
                <DashboardCard title={t('dashboard.maxScore')} count={maxScore} imgSrc={grow} link="/participant/evaluations" />
            </div>

            <div className="h-50">
                <EvaluationChart />
            </div>
        </div>
    );
};

export default DashboardParticipant;
