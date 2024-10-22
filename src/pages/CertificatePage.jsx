import React, { useEffect, useState } from 'react';
import axiosInstance from '../helper/axios';
import { getUser } from '../helper/auth';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const CertificatesPage = () => {
    const { t, i18n } = useTranslation('pages/certificate'); // Initialize translation
    const [certificates, setCertificates] = useState([]);
    const userId = getUser().userId;

    useEffect(() => {
        const fetchCertificates = async () => {
            const response = await axiosInstance.get(`/participants/${userId}/certificates`);
            setCertificates(response.data);
        };

        fetchCertificates();
    }, [userId]);

    return (
        <div className="p-6 bg-gradient-to-r" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <h1 className="text-4xl font-extrabold text-gray-700 mb-6 text-center">{t('certificates.title')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map(cert => (
                    <div key={cert.id} className="bg-white p-6 shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
                        <h2 className="text-2xl font-semibold text-gray-800">{cert.title}</h2>
                        <p className="text-gray-600">{t('certificates.issuedOn')}: {cert.issueDate}</p>
                        <a
                            href={`/certificates/${cert.id}`}
                            className="text-blue-600 mt-4 inline-block font-bold hover:text-blue-800 transition-colors"
                            download={cert.title}
                        >
                            {t('certificates.download')}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CertificatesPage;
