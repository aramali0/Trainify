import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authBg1 from '../assets/images/other/auth-cardbg-1.png';
import authBg2 from '../assets/images/other/auth-cardbg-2.png';
import '../assets/css/Login.css';
import axiosInstance from '../helper/axios';
import { EmailContext } from '../context/EmailContext';
import { useTranslation } from 'react-i18next';
import PageLoading from '../components/PageLosding';

const ResetPassword = () => {
    const { t } = useTranslation('auth/resetPassword');  // Hook for multi-language support
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setLoading] = useState(false);
    const { email } = useContext(EmailContext);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const newErrors = [];

        if (newPassword !== confirmPassword) {
            newErrors.push(t('resetPassword.errors.passwordMismatch'));  // Translation key for error
            setLoading(false);
        }

        if (newPassword.length < 8) {
            newErrors.push(t('resetPassword.errors.passwordLength'));  // Translation key for error
            setLoading(false);
        }

        if (newErrors.length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            await resetPassword(email, code, newPassword);
            setMessage(t('resetPassword.success'));  // Translation key for success message
            navigate('/login');
            setLoading(false);
        } catch (err) {
            setErrors([t('resetPassword.errors.serverError')]);  // Translation key for server error
            setLoading(false);
        }
    };

    const resetPassword = async (email, code, newPassword) => {
        const response = await axiosInstance.post('/auth/reset-password', { email, code, newPassword });
        console.log(response.data);
    }

    return (
        isLoading ? <PageLoading /> :
            <div className="login-container">
                <div className="login-content">
                    <div className="login-card">
                        <h4 className="login-title">{t('resetPassword.title')}</h4>  {/* Translation for title */}
                        <p className="login-subtitle">{t('resetPassword.subtitle')}</p>  {/* Translation for subtitle */}

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
                                <label htmlFor="reset-code" className="input-label">{t('resetPassword.fields.code')}</label>  {/* Translation for label */}
                                <input
                                    type="text"
                                    id="reset-code"
                                    name="code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="input-field"
                                    placeholder={t('resetPassword.placeholders.code')}  
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="new-password" className="input-label">{t('resetPassword.fields.newPassword')}</label>  
                                <input
                                    type="password"
                                    id="new-password"
                                    name="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="input-field"
                                    placeholder={t('resetPassword.placeholders.newPassword')}  
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="confirm-password" className="input-label">{t('resetPassword.fields.confirmPassword')}</label>  {/* Translation for label */}
                                <input
                                    type="password"
                                    id="confirm-password"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input-field"
                                    placeholder={t('resetPassword.placeholders.confirmPassword')}  
                                />
                            </div>

                            <div className="submit-container">
                                <button type="submit" className="submit-button">{t('resetPassword.buttons.submit')}</button>  {/* Translation for button */}
                            </div>
                        </form>
                    </div>

                    <div className="background-images">
                        <img src={authBg1} alt="Auth Background 1" className="background-image bg1" />
                        <img src={authBg2} alt="Auth Background 2" className="background-image bg2" />
                    </div>
                </div>
            </div>
    );
};

export default ResetPassword;
