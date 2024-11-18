import axios from 'axios';
import { logout } from './auth';
import i18next from 'i18next';

const API_URL = 'https://trainify-server-production-d321.up.railway.app/api'; 
// const API_URL = 'http://localhost:8081/api'; // Replace with your API URL

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add token to headers
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    const language = i18next.language || 'en';
    config.headers['Accept-Language'] = language;

    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Capture the current URL
            const currentUrl = window.location.pathname + window.location.search;

            // Perform logout
            logout();

            // Redirect to the login page with the current URL as a state parameter
            window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`;
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
