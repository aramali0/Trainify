import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HeroSection from '../components/Dashboard/HeroSection';
import DashboardCard from '../components/Dashboard/DashBoardCard';
import axiosInstance from '../helper/axios';
import ReactPaginate from 'react-paginate';
import ChartCard from '../components/Dashboard/ChartCart';
import welcomeImage from '../assets/PHOTO1.jpg';
import award from '../assets/images/icons/award.png';
import graduation from '../assets/images/icons/graduat.png';
import school from '../assets/images/icons/school.png';

const UserCard = ({ user }) => {
    const { t } = useTranslation('pages/adminDashboard');
    const [loadedImageUrl, setLoadedImageUrl] = useState("https://via.placeholder.com/150");

    useEffect(() => {
        const fetchImage = async () => {
            if (user.profileImagePath) {
                try {
                    const response = await axiosInstance.get(`${user.profileImagePath}`, {
                        responseType: 'blob'
                    });
                    const imageUrl = URL.createObjectURL(response.data);
                    setLoadedImageUrl(imageUrl);
                } catch (error) {
                    console.error(t("dashboardAdmin.imageError"), error);
                }
            }
        };

        fetchImage();
    }, [user.profileImagePath, t]);

    return (
        <li className="py-4 flex items-center">
            <div className="relative flex-shrink-0">
                <img
                    src={loadedImageUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-10 w-10 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
            </div>
            <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
            </div>
        </li>
    );
};

const DashboardAdmin = () => {
    const { t, i18n } = useTranslation('pages/adminDashboard');
    const [cours, setCours] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalResources, setTotalResources] = useState(0);
    const [activeUsers, setActiveUsers] = useState([]);
    const [entreprisesCount, setEntreprisesCount] = useState(0);
    const [viewMode, setViewMode] = useState('monthly');
    const [currentPage, setCurrentPage] = useState(0);
    const [paginatedUsers, setPaginatedUsers] = useState([]);
    const usersPerPage = 5;

    const [userChartData, setUserChartData] = useState({
        monthly: {
            labels: [],
            datasets: [
                {
                    label: t('dashboardAdmin.usersRegisteredByMonth'),
                    data: [],
                    fill: false,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                },
            ],
        },
        daily: {
            labels: [],
            datasets: [
                {
                    label: t('dashboardAdmin.usersRegisteredByDay'),
                    data: [],
                    fill: false,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                },
            ],
        },
    });

    useEffect(() => {
        setUserChartData(
            {
            monthly: {
                labels: [],
                datasets: [
                    {
                        label: t('dashboardAdmin.usersRegisteredByMonth'),
                        data: [],
                        fill: false,
                        backgroundcolor: 'rgba(54, 162, 235, 0.2)',
                        bordercolor: 'rgba(54, 162, 235, 1)',
                    },
                ],
            },
            daily: {
                labels: [],
                datasets: [
                    {
                        label: t('dashboardAdmin.usersRegisteredByday'),
                        data: [],
                        fill: false,
                        backgroundcolor: 'rgba(255, 99, 132, 0.2)',
                        bordercolor: 'rgba(255, 99, 132, 1)',
                    },
                ],
            },

                        }
            )
    }, [t,i18n.language]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const coursResponse = await axiosInstance.get("/cours");
                setCours(coursResponse.data);

                const usersResponse = await axiosInstance.get("/users/all");
                const users = usersResponse.data;
                setTotalUsers(users.length);

                const resourcesResponse = await axiosInstance.get("/resources");
                setTotalResources(resourcesResponse.data.length);
                
                const entreprisesResponse = await axiosInstance.get("/entreprises");
                setEntreprisesCount(entreprisesResponse.data.length);

                // Aggregate user registration data
                aggregateUserData(users);
            } catch (error) {
                console.error(t('dashboardAdmin.fetchError'), error);
            }
        };

        const fetchActiveUsers = async () => {
            try {
                const response = await axiosInstance.get("/users/active");
                setActiveUsers(response.data);
                console.log("Active Users length:", response.data.length);
            } catch (error) {
                console.error(t('dashboardAdmin.fetchActiveUsersError'), error);
            }
        };

        fetchData();
        fetchActiveUsers();

        const intervalId = setInterval(() => {
            fetchActiveUsers();
        }, 60000); // Fetch data every minute

        return () => clearInterval(intervalId);
    }, [t]);

    useEffect(() => {
        // Update paginatedUsers whenever activeUsers or currentPage changes
        const offset = currentPage * usersPerPage;
        setPaginatedUsers(activeUsers.slice(offset, offset + usersPerPage));
    }, [activeUsers, currentPage]);

    const aggregateUserData = (users) => {
        // Ensure that each user has a registrationDate field
        const monthlyCounts = {};
        const dailyCounts = {};

        users.forEach(user => {
            const registrationDate = new Date(user.registrationDate); // Adjust field name if necessary
            const month = registrationDate.toLocaleString('default', { month: 'short', year: 'numeric' });
            const day = registrationDate.toLocaleDateString();

            // Monthly aggregation
            if (monthlyCounts[month]) {
                monthlyCounts[month] += 1;
            } else {
                monthlyCounts[month] = 1;
            }

            // Daily aggregation
            if (dailyCounts[day]) {
                dailyCounts[day] += 1;
            } else {
                dailyCounts[day] = 1;
            }
        });

        // Sort the labels
        const sortedMonthlyLabels = Object.keys(monthlyCounts).sort((a, b) => {
            const [monthA, yearA] = a.split(' ');
            const [monthB, yearB] = b.split(' ');
            const dateA = new Date(`${monthA} 1, ${yearA}`);
            const dateB = new Date(`${monthB} 1, ${yearB}`);
            return dateA - dateB;
        });

        const sortedDailyLabels = Object.keys(dailyCounts).sort((a, b) => new Date(a) - new Date(b));

        setUserChartData({
            monthly: {
                labels: sortedMonthlyLabels,
                datasets: [
                    {
                        ...userChartData.monthly.datasets[0],
                        data: sortedMonthlyLabels.map(label => monthlyCounts[label]),
                    },
                ],
            },
            daily: {
                labels: sortedDailyLabels,
                datasets: [
                    {
                        ...userChartData.daily.datasets[0],
                        data: sortedDailyLabels.map(label => dailyCounts[label]),
                    },
                ],
            },
        });
    };

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} className="space-y-6">
            <HeroSection
                title={t('dashboardAdmin.welcomeBack')}
                description={t('dashboardAdmin.overviewDescription')}
                buttonText={t('dashboardAdmin.viewCourses')}
                buttonLink="/admin/courses"
                imageSrc={welcomeImage}
                nom='/admin'
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard title={t('dashboardAdmin.courses')} count={cours.length} imgSrc={graduation} link="/admin/courses" />
                <DashboardCard title={t('dashboardAdmin.entreprises')} count={entreprisesCount} imgSrc={award} link="/admin/entreprises" />
                <DashboardCard title={t('dashboardAdmin.allUsers')} count={totalUsers} imgSrc={school} link="/admin/users" />
                <DashboardCard title={t('dashboardAdmin.resources')} count={totalResources} imgSrc={school} link="/admin/library" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-3">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">{t('dashboardAdmin.usersRegistered')}</h2>
                        <div className="flex items-center">
                            <span className={`mr-2 font-medium ${viewMode === 'daily' ? 'text-gray-600' : 'text-blue-600'}`}>{t('dashboardAdmin.monthly')}</span>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input
                                    type="checkbox"
                                    name="toggle"
                                    id="toggle"
                                    checked={viewMode === 'daily'}
                                    onChange={() => handleViewModeChange(viewMode === 'monthly' ? 'daily' : 'monthly')}
                                    className={`toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer ${viewMode === 'daily' ? 'border-red-600 bg-red-600 left-0' : 'border-gray-300 right-0'}`}
                                />
                                <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                            </div>
                            <span className={`ml-2 font-medium ${viewMode === 'daily' ? 'text-red-600' : 'text-gray-600'}`}>{t('dashboardAdmin.daily')}</span>
                        </div>
                    </div>

                    <ChartCard
                        title={t(`dashboardAdmin.usersRegisteredBy${viewMode === 'monthly' ? 'Month' : 'Day'}`)}
                        chartData={viewMode === 'monthly' ? userChartData.monthly : userChartData.daily}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">{t('dashboardAdmin.onlineUsers')}</h2>
                <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">{t('dashboardAdmin.onlineUsersCount', { count: activeUsers.length })}</h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {paginatedUsers.length > 0 ? (
                            paginatedUsers.map(user => (
                                <UserCard key={user.email} user={user} />
                            ))
                        ) : (
                            <li className="py-4 text-center text-gray-500">{t('dashboardAdmin.noOnlineUsers')}</li>
                        )}
                    </ul>
                    {activeUsers.length > usersPerPage && (
                        <div className="mt-4">
                            <ReactPaginate
                                previousLabel={t('dashboardAdmin.previous')}
                                nextLabel={t('dashboardAdmin.next')}
                                pageCount={Math.ceil(activeUsers.length / usersPerPage)}
                                onPageChange={handlePageClick}
                                containerClassName={"pagination"}
                                activeClassName={"active"}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;
