import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ContactList from '../components/message/ContactList';
import ChatConversation from '../components/message/ChatConversation';
import styles from '../assets/css/ChatPage.module.css';
import { getUser } from '../helper/auth';
import axiosInstance from '../helper/axios';

const ChatPage = ({path,nom}) => {
    const [showContacts, setShowContacts] = useState(false);
    const [activeReceiver, setActiveReceiver] = useState(null);
    const [unreadMessages, setUnreadMessages] = useState({});
    const navigate = useNavigate();
    const user = getUser();
    const id = getUser().userId;
    const email = user.sub;
    useEffect(() => {
        getunReadMessages();
    }, [user.userId]);

    const toggleContacts = () => {
        setShowContacts(prevState => !prevState);
    };

    const getunReadMessages = async () => {
        try {
            const res = await axiosInstance.get(`/messages/unread`);
            setUnreadMessages(res.data);
        } catch (error) {
            console.error("Error fetching unread messages count", error);
        }
    };

    const handleContactClick = (receiverId) => {
        setActiveReceiver(receiverId);
        setShowContacts(false); // Hide contacts list after selecting a contact on mobile

        // Mark messages as read
        setUnreadMessages(prev => ({
            ...prev,
            [receiverId]: 0, // Reset unread count for this receiver
        }));
    };

    const handleNewMessage = (senderId) => {
        setUnreadMessages(prev => ({
            ...prev,
            [senderId]: (prev[senderId] || 0) + 1
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <button
                    className={`${styles.toggleButton} ${showContacts ? styles.activeToggle : ''}`}
                    onClick={toggleContacts}
                >
                    ☰
                </button>
                <div className={`${styles.contactList} ${showContacts ? styles.active : ''}`}>
                    <ContactList
                        email={email}
                        onContactClick={handleContactClick}
                        activeReceiver={activeReceiver}
                        unreadMessages={unreadMessages}
                        nom={nom}
                        path={path}
                    />
                </div>
                <div className={styles.content}>
                    <Routes>
                        <Route path=":receiverId" element={<ChatConversation activeReceiver={activeReceiver} onNewMessage={handleNewMessage} />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;