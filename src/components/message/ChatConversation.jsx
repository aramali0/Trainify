import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook
import axiosInstance from '../../helper/axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import styles from '../../assets/css/ChatConversation.module.css';
import { getUser } from '../../helper/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChatConversation = ({ activeReceiver, onNewMessage }) => {
    const { t, i18n } = useTranslation('pages/chatConversation'); // Use the translation hook
    const { receiverId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [receiver, setReceiver] = useState({});
    const messageEndRef = useRef(null);
    const user = getUser(); 
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axiosInstance.get(`/messages/conversation?senderId=${user.userId}&receiverId=${receiverId}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        const getReceiver = async () => {
            try {
                const response = await axiosInstance.get(`/users/${receiverId}`);
                setReceiver(response.data);
            } catch (error) {
                console.error('Error fetching receiver:', error);
            }
        };

        getReceiver();
        fetchMessages();
    }, [receiverId, user.userId]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        const socket = new SockJS(`${axiosInstance.defaults.baseURL.replace('http', 'https')}/wss`);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                client.subscribe(`/user/${user.userId}/queue/messages`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    if (String(receivedMessage.senderId) === receiverId)
                        setMessages(prevMessages => [...prevMessages, receivedMessage]);

                    if (String(receivedMessage.senderId) !== receiverId) {
                        toast.info(t('new_message_notification'));
                        onNewMessage(receivedMessage.senderId);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker error: ' + frame.headers['message']);
            },
        });

        client.activate();
        setStompClient(client);

        return () => {
            if (client) client.deactivate();
        };
    }, [user.userId, receiverId, onNewMessage, t]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            const messageDto = {
                content: newMessage,
                senderId: user.userId,
                receiverId: receiverId,
                timestamp: new Date().toISOString(),
            };

            await axiosInstance.post('/messages', messageDto);
            setMessages(prevMessages => [...prevMessages, messageDto]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        const options = { month: 'short', day: 'numeric' };
        return isToday ? t('today') : date.toLocaleDateString(undefined, options);
    };

    const renderMessages = () => {
        let lastDate = '';
        return messages.map((message, index) => {
            const messageDate = new Date(message.timestamp).toDateString();
            const isDifferentDay = lastDate !== messageDate;
            lastDate = messageDate;

            return (
                <React.Fragment key={index}>
                    {isDifferentDay && (
                        <div className={styles.dateSeparator}>
                            <span>{formatDate(message.timestamp)}</span>
                        </div>
                    )}
                    <div
                        className={`${styles.messageBubble} ${message.senderId === user.userId ? styles.sent : styles.received}`}
                    >
                        <div className={styles.messageContent}>
                            <p>{message.content}</p>
                            <p className={styles.timestamp}>
                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                </React.Fragment>
            );
        });
    };

    return (
        <div 
            className={styles.chatContainer}
            dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} // Set direction for RTL when Arabic
        >
            <ToastContainer />
            <div className={styles.header}>
                <h2 className={styles.name}>
                    {t('chat_with')} {receiver.firstName || receiver.lastName}
                </h2>
            </div>
            <div className={styles.messageList}>
                {renderMessages()}
                <div ref={messageEndRef} />
            </div>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    placeholder={t('type_message')}
                    className={styles.inputField}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessage} className={styles.sendButton}>
                    {t('send')}
                </button>
            </div>
        </div>
    );
};

export default ChatConversation;
