import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, json } from 'react-router-dom';
import UserProfile from '../components/Dashboard/UserProfile';
import { getUser } from '../helper/auth';
import axiosInstance from '../helper/axios';
import { Client } from '@stomp/stompjs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SockJS from 'sockjs-client';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/Dashboard/LanguageSelector';

const AdminLayout = () => {
const { t, i18n } = useTranslation('pages/adminLayout'); // Initialize translation hook
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState({});
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [receiver, setReceiver] = useState({})
    const res = getUser();
    const id = getUser().userId;
    const location = useLocation();
    const [client, setClient] = useState(null);
    const [loadedImageUrl, setLoadedImageUrl] = useState(null);

    useEffect(() => {
        const fetchImageWithAuth = async () => {
            try {
                const response = await axiosInstance.get(`${user.profileImagePath}`, {
                    responseType: 'blob'  // Handle binary data
                });
                const imageUrl = URL.createObjectURL(response.data);
                setLoadedImageUrl(imageUrl);
            } catch (error) {
                console.error("Error fetching image:", error);
                setLoadedImageUrl("https://via.placeholder.com/150");  // Fallback image
            }
        };

        if (user.profileImagePath) {
            fetchImageWithAuth();
        } else {
            setLoadedImageUrl("https://via.placeholder.com/150");  // Fallback image if no imagePath
        }

    }, [user.profileImagePath]);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const fetchReceiver = async (id) => {
        const response = await axiosInstance.get(`/users/${id}`);
        setUser(response.data);
    }

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

        // Set an interval to fetch unread messages count every minute
        const intervalId = setInterval(fetchUnreadMessages, 60000);

        return () => clearInterval(intervalId); // Cleanup on component unmount
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

                    fetchReceiver(notification.aLong)

                    if (receiver.firstName !== null) {
                        toast.info("New message from " + receiver.firstName);
                    }
                    else {
                        toast.info("New message");
                    }

                    axiosInstance.get(`/messages/unread/${id}`).then((response) => {
                        setUnreadMessages(response.data);
                    });
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

    return (
  <div
            dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} // Dynamic RTL/LTR support
            className={`flex h-[100vh] overflow-hidden bg-gray-100`}
        >
            <ToastContainer />
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
                   {t('admin.admin')}
                </div>
               <nav className="space-y-1">
          <Link to="/admin" className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === "/admin" ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            {t('admin.dashboard')}
          </Link>
          <Link to={`/admin/courses`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === `/admin/courses` ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            {t('admin.courses')}
          </Link>
          <Link to={`/admin/banners`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === `/admin/banners` ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            {t('admin.banners')}
          </Link>
          <Link to={`/admin/about-us`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === `/admin/about-us` ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            {t('admin.about_us')}
          </Link>
          <Link to={`/admin/events`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === `/admin/events` ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            {t('admin.events')}
          </Link>
          <Link to={`/admin/messages`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === `/admin/messages` ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            {t('admin.messages')}
          </Link>
          <Link to={`/admin/contact-info`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === `/admin/contact-info` ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            {t('admin.contact_info')}
          </Link>
          <Link to={`/admin/pricing`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === `/admin/pricing` ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            {t('admin.manage_pricing')}
          </Link>
          <Link to={`/admin/payments`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === `/admin/payments` ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            {t('admin.payments')}
          </Link>
          <Link to={`/admin/feedbacks`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === `/admin/feedbacks` ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            {t('admin.feedbacks')}
          </Link>
        </nav>
            </aside>
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between bg-white shadow-md p-4">
                    <button className="text-gray-600 focus:outline-none md:hidden" onClick={toggleSidebar}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                    {/* <h1 className="text-xl font-semibold text-gray-800">{t('admin.dashboard')}</h1> */}
                    <div className=" w-full flex items-center justify-between space-x-4 gap-4">
                        <div className=' w-1/2 flex items-center justify-start gap-4'>
                        <LanguageSelector />
                        <Link to="/admin/chat" className="relative text-gray-600 hover:text-gray-800">
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
                        <UserProfile user={{ name: user.firstName, email: user.lastName, avatar: loadedImageUrl }} nom="/admin" />
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
