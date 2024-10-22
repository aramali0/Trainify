// src/pages/BannersPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../helper/axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import QuizModal from '../components/QuizModal'; // Assuming you have this component
import { useTranslation } from 'react-i18next';

const BannersPage = () => {
    const [banners, setBanners] = useState([]);
    const { t } = useTranslation('pages/bannerPage'); // Specify the namespace

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await axiosInstance.get('/banners');
                const updatedBanners = await Promise.all(response.data.map(async (banner) => {
                    const loadedImageUrl = await fetchImageWithAuth(banner.backgroundImage);
                    return { ...banner, loadedImageUrl };
                }));
                setBanners(updatedBanners);
            } catch (error) {
                console.error('Error fetching banners:', error);
                // Optionally, add a toast notification
            }
        };

        fetchBanners();
    }, []);

    const fetchImageWithAuth = async (backgroundImage) => {
        try {
            const response = await axiosInstance.get(`http://localhost:8087/api${backgroundImage}`, {
                responseType: 'blob' // Handle binary data
            });
            return URL.createObjectURL(response.data);
        } catch (error) {
            console.error('Error fetching image:', error);
            return null;
        }
    };

    const handleDelete = async (bannerId) => {
        if (window.confirm(t('messages.confirmDeleteBanner'))) {
            try {
                await axiosInstance.delete(`/banners/${bannerId}`);
                setBanners(banners.filter(banner => banner.id !== bannerId));
                // Optionally, add a success toast
            } catch (error) {
                console.error('Error deleting banner:', error);
                // Optionally, add an error toast
            }
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">{t('titles.banners')}</h1>
                <Link to="/admin/banners/create" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300">
                    {t('buttons.createBanner')}
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {banners.map(banner => (
                    <div key={banner.id} className="relative bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 transform hover:scale-105">
                        <div className="relative h-40 md:h-48 overflow-hidden">
                            <img 
                                src={banner.loadedImageUrl || "https://via.placeholder.com/400"} 
                                alt={banner.title} 
                                className="w-full h-full object-cover" 
                                onError={(e) => e.target.src = "https://via.placeholder.com/400"}
                            />
                            <div className="absolute top-2 right-2 flex space-x-2">
                                {/* <Link to={`/admin/banners/update/${banner.id}`} className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition duration-300" aria-label={t('aria.editBanner')}>
                                    <FaEdit className="text-gray-700" />
                                </Link> */}
                                <button
                                    onClick={() => handleDelete(banner.id)}
                                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
                                    aria-label={t('aria.deleteBanner')}
                                >
                                    <FaTrashAlt className="text-red-600" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h5 className="text-lg font-medium mb-2 truncate">{banner.title}</h5>
                            <p className="text-gray-600 mb-4 truncate">{banner.subtitle || t('messages.noSubtitle')}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BannersPage;
