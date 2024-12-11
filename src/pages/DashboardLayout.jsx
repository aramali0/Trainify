import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import UserProfile from '../components/Dashboard/UserProfile';
import { getUser } from '../helper/auth';
import axiosInstance from '../helper/axios';
import { Client } from '@stomp/stompjs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SockJS from 'sockjs-client';
import FeedbackForm from './FeeBackForm';
import { useTranslation } from 'react-i18next';  
import LanguageSelector from '../components/Dashboard/LanguageSelector';

const DashboardLayout = ({ role, nom }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState({});
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [receiver, setReceiver] = useState({});
    const [quizNotifications, setQuizNotifications] = useState([]);  
    const [unreadQuizNotifications, setUnreadQuizNotifications] = useState(0);  
    const [showQuizNotifications, setShowQuizNotifications] = useState(false);  
    const res = getUser();
    const id = getUser().userId;
    const location = useLocation();
    const [client, setClient] = useState(null);
    const [loadedImageUrl, setLoadedImageUrl] = useState(null);

    const { t, i18n } = useTranslation('pages/dashboardLayout');  

    useEffect(() => {
        const fetchImageWithAuth = async () => {
            try {
                const response = await axiosInstance.get(`${user.profileImagePath}`, {
                    responseType: 'blob'
                });
                const imageUrl = URL.createObjectURL(response.data);
                setLoadedImageUrl(imageUrl);
            } catch (error) {
                console.error("Error fetching image:", error);
                setLoadedImageUrl("https://via.placeholder.com/150");
            }
        };

        if (user.profileImagePath) {
            fetchImageWithAuth();
        } else {
            setLoadedImageUrl("https://via.placeholder.com/150");
        }
    }, [user.profileImagePath]);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const fetchReceiver = async (id) => {
        const response = await axiosInstance.get(`/users/${id}`);
        setUser(response.data);
    };

    useEffect(() => {
        const fetchUser = async () => {
            const response = await axiosInstance.get(`/users/${id}`);
            setUser(response.data);
        };

        const fetchUnreadMessages = async () => {
            const response = await axiosInstance.get(`/messages/unread/${id}`);
            setUnreadMessages(response.data);
        };

        fetchUser();
        fetchUnreadMessages();

        const intervalId = setInterval(fetchUnreadMessages, 60000);
        return () => clearInterval(intervalId);
    }, [id]);

    useEffect(() => {
        const socket = new SockJS(`${axiosInstance.defaults.baseURL}/ws`);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                client.subscribe(`/user/${id}/queue/notifications`, (message) => {
                    const notification = JSON.parse(message.body);

                    fetchReceiver(notification.aLong);
                    if (receiver.firstName) {
                        toast.info(t('notifications.newMessageFrom', { name: receiver.firstName }));
                    } else {
                        toast.info(t('notifications.newMessage'));
                    }

                    axiosInstance.get(`/messages/unread/${id}`).then((response) => {
                        setUnreadMessages(response.data);
                    });
                });

                // Subscribe to quiz notifications
                client.subscribe(`/user/${id}/queue/quiz's`, (message) => {
                    const quizNotification = JSON.parse(message.body);
                    setQuizNotifications((prev) => [...prev, quizNotification]);
                    setUnreadQuizNotifications((prevCount) => prevCount + 1);
                    toast.info(t('notifications.newQuizNotification'));
                });
            },
            onStompError: (frame) => {
                console.error('Broker error: ' + frame.headers['message']);
            },
        });

        client.activate();
        setClient(client);

        return () => {
            if (client) client.deactivate();
        };
    }, [id]);

    // Mark all quiz notifications as read
    const markQuizNotificationsAsRead = () => {
        setUnreadQuizNotifications(0);  // Reset unread quiz count
    };

    return (
        <div className={`flex h-screen overflow-hidden bg-gray-100 ${i18n.language === 'ar' ? 'rtl' : ''}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <ToastContainer />
            {/* <div className="feedback-section">
                <FeedbackForm />
            </div> */}
            <aside
                className={`bg-gray-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 transition duration-300 ease-in-out transform ${
                    isSidebarOpen
                        ? 'translate-x-0'
                        : i18n.language === 'ar'
                        ? 'translate-x-full'
                        : '-translate-x-full'
                } md:relative md:translate-x-0 overflow-y-auto z-[100] ${
                    i18n.language === 'ar' ? 'right-0' : 'left-0'
                } ${i18n.language === 'ar' ? 'md:right-auto' : 'md:left-auto'}`}
            >
                <div className="text-center text-2xl font-semibold py-4">
                    {role}
                </div>
                <nav className="space-y-1">
                    <Link to={nom} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === nom ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                        {t('sidebar.dashboard')}
                    </Link>
                    <Link to={`${nom}/courses`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === `${nom}/courses` ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                        {t('sidebar.courses')}
                    </Link>
                    <Link to={`${nom}/sessions`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === `${nom}/sessions` ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                        {t('sidebar.sessions')}
                    </Link>
                    <Link to={`${nom}/sections`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === `${nom}/sections` ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                        {t('sidebar.sections')}
                    </Link>
                    <Link to={`${nom}/calendar`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === `${nom}/calendar` ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                        {t('sidebar.calendar')}
                    </Link>
                    <Link to={`${nom}/classes`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === `${nom}/classes` ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                        {t('sidebar.classes')}
                    </Link>
                    <Link to={`${nom}/library`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === `${nom}/library` ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                        {t('sidebar.libraries')}
                    </Link>
                    { nom === "/responsable" && <Link to={`${nom}/participants`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === `${nom}/participants` ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                        {t('sidebar.verification')}
                    </Link>}
                    { nom === "/responsable" && <Link to={`${nom}/action-approval`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === `${nom}/action-approval` ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                        {t('sidebar.approvals')}
                    </Link>}
                    { nom === "/charge-formation" && <Link to={`${nom}/approvals`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === `${nom}/approvals` ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                        {t('sidebar.approvals')}
                    </Link>}
                    { (nom === "/responsable" || nom == "/formateur" || nom == "/participant") && <Link to={`${nom}/evaluation-formations`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === `${nom}/evaluation-formations` ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                        {t('sidebar.evalFormations')}
                    </Link>}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between bg-white shadow-md p-4">
                    <button className="text-gray-600 focus:outline-none md:hidden" onClick={toggleSidebar}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                    {/* <h1 className="text-xl font-semibold text-gray-800">{t('dashboard.title')}</h1> */}
                    <div className=" w-full flex items-center justify-between space-x-4 gap-4">
                        <div className="w-1/2 flex justify-start items-center gap-4 relative ">
                        <LanguageSelector />
                            <button
                                onClick={() => { setShowQuizNotifications(!showQuizNotifications); markQuizNotificationsAsRead(); }}
                                className="relative text-gray-600 hover:text-gray-800 focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0018 15H6a2.032 2.032 0 00-1.595.595L3 17h5m7 0V19a2 2 0 01-2 2H9a2 2 0 01-2-2v-2m10 0H6" />
                                </svg>
                                {unreadQuizNotifications > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                        {unreadQuizNotifications}
                                    </span>
                                )}
                            </button>
                            {showQuizNotifications && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden">
                                    <ul className="list-none">
                                        {quizNotifications.map((quiz, index) => (
                                            <li key={index} className="px-4 py-2 border-b">
                                                {quiz.message}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        <Link to={`${nom}/chat`} className="relative text-gray-600 hover:text-gray-800">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 4V10a2 2 0 012-2h2m5-2h.01M21 12h.01M15 12h.01M9 12h.01M3 12h.01M12 12h.01M3 7h.01M21 7h.01M15 7h.01M9 7h.01M12 17h.01" />
                            </svg>
                            {unreadMessages > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                    {unreadMessages}
                                </span>
                            )}
                        </Link>
                        </div>
                        <UserProfile user={{ name: user.firstName, email: user.lastName, avatar: loadedImageUrl }} nom={nom} />
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
