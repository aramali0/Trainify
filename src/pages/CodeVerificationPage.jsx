import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../helper/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

const CodeVerificationPage = () => {
    const { t } = useTranslation('auth/codeVerification'); // Use translation hook
    const [code, setCode] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const { email } = useParams();
    const navigate = useNavigate();
    const isRTL = i18next.language === 'ar';  // Check if the language is RTL

    const handleVerifyCode = async () => {
        try {
            const response = await axiosInstance.post('/auth/activation', { code });
            toast.success(t('codeVerification.successVerificationMessage'), { position: "top-right" });
            setShowPopup(true);
        } catch (error) {
            toast.error(t('codeVerification.errorMessage'), { position: "top-right" });
        }
    };

    const handleResendCode = async () => {
        try {
            const response = await axiosInstance.post(`/auth/resend-code/${email}`);
            toast.success(t('codeVerification.successMessage'), { position: "top-right" });
        } catch (error) {
            console.log(error);
            toast.error(t('codeVerification.errorMessage'), { position: "top-right" });
        }
    };

    return (
        <div className={`min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isRTL ? 'text-right' :'text-left'}`}>
            <ToastContainer />
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {t('codeVerification.popupMessage')}
                        </h2>
                        <button
                            onClick={() => { 
                                setShowPopup(false);
                                navigate('/login');
                            }}
                            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        {t('codeVerification.title')}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {t('codeVerification.description')}
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleVerifyCode(); }}>
                    <input
                        type="text"
                        name="code"
                        placeholder={t('codeVerification.verificationCode')}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300"
                    />
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {t('codeVerification.verifyButton')}
                    </button>
                </form>
                <button
                    onClick={handleResendCode}
                    className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    {t('codeVerification.resendButton')}
                </button>
            </div>
        </div>
    );
};

export default CodeVerificationPage;

