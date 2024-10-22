import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axiosInstance from '../helper/axios';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

const Success = () => {
    const { t, i18n } = useTranslation('page/success'); // Use translation hook
    const location = useLocation();
    const sessionId = new URLSearchParams(location.search).get('session_id');
    const [email, setEmail] = useState('');
    const [receiptUrl, setReceiptUrl] = useState('');

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await axiosInstance.get(`/payment/details?session_id=${sessionId}`);
                setEmail(response.data.name);
                setReceiptUrl(response.data.receiptUrl);
            } catch (error) {
                console.error('Failed to fetch payment details:', error);
            }
        };

        fetchPaymentDetails();
    }, [sessionId]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8 px-4" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-green-600 mb-4">{t('success.title')}</h1>
                    <p className="text-lg text-gray-700 mb-6">
                        {t('success.thankYouMessage', { email })} {/* Use translation with variable */}
                    </p>
                    <div className="flex flex-col items-center gap-4">
                        {receiptUrl && (
                            <a href={receiptUrl} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition" target="_blank" rel="noopener noreferrer">
                                {t('success.downloadReceipt')}
                            </a>
                        )}
                        <Link to="/" className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-900 transition">
                            {t('success.goToHome')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Success;
