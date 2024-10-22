import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../helper/axios';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import styles from '../../assets/css/ContactList.module.css';
import image from '../../assets/images/avatars/avatar-1.png';
import { getUser } from '../../helper/auth';

const ContactList = ({ email, onContactClick, activeReceiver, unreadMessages, path, nom }) => {
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const id = getUser().userId;
    const { t, i18n } = useTranslation('pages/contactList'); // Initialize translation hook

    const navigate = useNavigate();
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                var response;
                if (path === '/admin') {
                    response = await axiosInstance.get('/users');
                } else {
                    response = await axiosInstance.get(`${path}/${id}/contacts`);
                }
                setContacts(response.data);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };

        fetchContacts();

        // Update statuses every 5 minutes
        const intervalId = setInterval(fetchContacts, 5 * 60 * 1000);

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, [email]);

    const handleSearch = async (event) => {
        setSearchTerm(event.target.value);
        if (event.target.value !== '') {
            try {
                var response;
                if (path === '/admin') {
                    response = await axiosInstance.get(`/users/search?name=${event.target.value}`);
                } else {
                    response = await axiosInstance.get(`${path}/${id}/contacts/search?name=${event.target.value}`);
                }
                setContacts(response.data);
            } catch (error) {
                console.error('Error searching contacts:', error);
            }
        } else {
            var response;
            if (path === '/admin') {
                response = await axiosInstance.get('/users');
            } else {
                response = await axiosInstance.get(`${path}/${id}/contacts`);
            }
            setContacts(response.data);
        }
    };

    const isUserOnline = (lastActiveTime) => {
        const lastActiveDate = new Date(lastActiveTime);
        const now = new Date();
        const differenceInMinutes = (now - lastActiveDate) / (1000 * 60);
        return differenceInMinutes < 5; // Online if active within the last 5 minutes
    };

    const formatLastActiveTime = (lastActiveTime) => {
        const date = new Date(lastActiveTime);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    // Add dynamic RTL support for Arabic
    useEffect(() => {
        document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    }, [i18n.language]);

    return (
        <div className={styles.contactList}>
            <div className={styles.header}>
                {t('contacts')}
                <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={handleSearch}
                    className={styles.searchInput}
                />
            </div>
            <div className={styles.list}>
                {contacts.map(contact => (
                    contact.email !== email && (
                        <Link
                            to={`${nom}/chat/${contact.userId}`}
                            key={contact.userId}
                            className={`${styles.contactItem} ${contact.userId === activeReceiver ? styles.active : ''}`}
                            onClick={() => onContactClick(contact.userId)}
                        >
                            {unreadMessages[contact.userId] > 0 && (
                                <div className={styles.unreadMessageCount}>
                                    <span>{unreadMessages[contact.userId]}</span>
                                </div>
                            )}
                            <img src={contact.avatar || image} className={styles.avatar} alt={contact.firstName} />
                            <div className={styles.details}>
                                <div className={styles.headerDetails}>
                                    <h6>{contact.firstName} {contact.lastName}</h6>
                                </div>
                                <div className={styles.status}>
                                    {isUserOnline(contact.lastActiveTime) ? (
                                        <span className={styles.onlineStatus}>
                                            <span className={styles.onlineDot}></span> {t('online')}
                                        </span>
                                    ) : (
                                        <span className={styles.offlineStatus}>
                                            {t('lastActive')}{formatLastActiveTime(contact.lastActiveTime)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    )
                ))}
            </div>
            <button className={styles.backButton} onClick={() => navigate(`${nom}`)}>
                &larr; {t('backButton')}
            </button>
        </div>
    );
};

export default ContactList;
