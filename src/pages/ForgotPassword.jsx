import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';  // Import i18n hook
import '../assets/css/Login.css';
import axiosInstance from '../helper/axios';
import { EmailContext } from '../context/EmailContext';
import PageLoading from '../components/PageLosding';
import LanguageSelector from '../components/Dashboard/LanguageSelector';

const ForgotPassword = () => {
    const { t } = useTranslation('auth/forgotPassword');  // Initialize translation hook
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setLoading] = useState(false);
    const { setEmail: setContextEmail } = useContext(EmailContext);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const newErrors = [];

        if (!validateEmail(email)) {
            newErrors.push(t('forgotPassword.errors.invalidEmail'));  // Use translation for error
            setLoading(false);
        }

        if (newErrors.length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            await sendPasswordResetEmail(email);
            setContextEmail(email);
            setMessage(t('forgotPassword.success.emailSent'));  // Use translation for success message
            navigate('/reset-password');
            setLoading(false);

        } catch (err) {
            setErrors([t('forgotPassword.errors.emailSendFailed')]);  // Use translation for error
            setLoading(false);
        }
    };

    const sendPasswordResetEmail = async (email) => {
        const response = await axiosInstance.post('/auth/forgot-password', { email });
        console.log(response.data);
    };

    return (
        <div className="login-container flex justify-center items-center">
            <div className="login-content">
                {isLoading ? <PageLoading /> :
                    (
                        <div className="login-card">
                            <h4 className="login-title">{t('forgotPassword.title')}</h4>  {/* Use translation for title */}
                            <p className="login-subtitle">{t('forgotPassword.subtitle')}</p>  {/* Use translation for subtitle */}

                            <form onSubmit={handleSubmit} className="login-form">
                                {errors.length > 0 && (
                                    <div className="error-messages">
                                        {errors.map((error, index) => (
                                            <p key={index} className="error-text">{error}</p>
                                        ))}
                                    </div>
                                )}
                                {message && <p className="success-text">{message}</p>}

                                <div className="input-group">
                                    <label htmlFor="ForgotPasswordEmail" className="input-label">
                                        {t('forgotPassword.emailLabel')}  {/* Use translation for email label */}
                                    </label>
                                    <input
                                        type="email"
                                        id="ForgotPasswordEmail"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-field"
                                        placeholder={t('forgotPassword.emailPlaceholder')}  
                                    />
                                </div>

                                <div className="submit-container">
                                    <button type="submit" className="submit-button">
                                        {t('forgotPassword.submitButton')}  {/* Use translation for button */}
                                    </button>
                                </div>
                                <LanguageSelector  />
                            </form>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default ForgotPassword;
