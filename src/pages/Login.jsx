import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';  // Import the useTranslation hook
import logoDark from '../assets/ehc_logo.svg';
import logoLight from '../assets/ehc_logo.svg';
import { login } from '../helper/auth';
import '../assets/css/Login.css';
import { EmailContext } from '../context/EmailContext';
import LanguageSelector from '../components/Dashboard/LanguageSelector';
import i18next from 'i18next';

const Login = () => {
    const { t } = useTranslation('auth/login');  // Initialize the translation function
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const location = useLocation(); // Access the location object
    const { setEmail: setContextEmail, setId } = useContext(EmailContext);
    const isRTL = i18next.language === 'ar';  // Check if the language is RTL

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = [];

        if (!validateEmail(email)) {
            newErrors.push(t('login.invalidEmail'));  // Use the translated error message
        }

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            // Attempt to login
            const { accessToken } = await login(email, password, rememberMe);

            // Decode the JWT token
            const user = JSON.parse(atob(accessToken.split('.')[1])); // Assuming the payload is base64-encoded

            console.log('User:', user);
            // Set email and ID in the context
            setId(user.userId);
            setContextEmail(user.sub);

            // Determine the redirect path
            const redirectTo = location.state?.from || new URLSearchParams(location.search).get('redirect'); // Redirect to the intended page or default to '/dashboard'

            // Check roles and navigate accordingly
            const scopes = user.scope.split(" ");
            const roles = scopes || [];

            if (roles.length === 1) {
                navigate(redirectTo || getDashboardPath(roles[0]));
            } else if (roles.length > 1) {
                navigate('/choose-role', { state: { roles } });
            } else {
                setErrors([t('login.invalidCredentials')]);  // Use the translated error message
            }
        } catch (err) {
            setErrors([t('login.invalidCredentials')]);  // Use the translated error message
            console.error('Error logging in:', err);
        }
    };

    const getDashboardPath = (role) => {
        console.log('Role:', role);
        switch (role) {
            case 'ROLE_ADMIN':
                return '/admin';
            case 'ROLE_FORMATEUR':
                return '/formateur';
            case 'ROLE_RESPONSABLE':
                return '/responsable';
            case 'ROLE_PARTICIPANT':
                return '/participant';
            case 'ROLE_CHARGE':
                return '/charge-formation';
            default:
                return '/';
        }
    };

    return (
        <div className={`login-container ${isRTL ? 'text-right' : 'text-left'} `}>
            <div className="login-content">
                <div className="login-card">
                    <Link to="/" className="logo-container w-100 m-auto">
                        <img className="logo" src={logoDark} alt="Logo Dark" />
                        <img className="logo dark" src={logoLight} alt="Logo Light" />
                    </Link>

                    <h4 className="login-title">{t('login.title')}</h4>  {/* Use translated title */}
                    <p className="login-subtitle">{t('login.subtitle')}</p>  {/* Use translated subtitle */}

                    <form onSubmit={handleSubmit} className="login-form">
                        {errors.length > 0 && (
                            <div className="error-messages">
                                {errors.map((error, index) => (
                                    <p key={index} className="error-text">{error}</p>
                                ))}
                            </div>
                        )}

                        <div className="input-group">
                            <label htmlFor="LogInEmailAddress" className="input-label">{t('login.emailLabel')}</label>  {/* Use translated label */}
                            <input
                                type="email"
                                id="LogInEmailAddress"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder={t('login.emailLabel')} 
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="form-password" className="input-label">{t('login.passwordLabel')}</label>  {/* Use translated label */}
                            <div className="password-container">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="form-password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field password-input"
                                    placeholder={t('login.passwordLabel')} 
                                />
                                <button
                                    type="button"
                                    id="password-addon"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={showPassword ? 'eye-off' : 'eye'}></i>
                                </button>
                            </div>
                        </div>

                        <div className="options-container">
                            <div className="remember-me">
                                <input
                                    type="checkbox"
                                    id="checkbox-signin"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="checkbox"
                                />
                                <label className="checkbox-label" htmlFor="checkbox-signin">{t('login.rememberMe')}</label>  {/* Use translated label */}
                            </div>
                            <Link to="/forgot-password" className="forgot-password">{t('login.forgotPassword')}</Link>  {/* Use translated link */}
                        </div>

                        <div className="submit-container">
                            <button type="submit" className="submit-button">{t('login.submitButton')}</button>  {/* Use translated button text */}
                        </div>
                        <LanguageSelector  />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
