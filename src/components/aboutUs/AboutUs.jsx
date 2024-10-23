import React, { useEffect, useState } from 'react';
import axiosInstance from '../../helper/axios';
import { useTranslation } from 'react-i18next';

const AboutUsSection = () => {
    const { t, i18n } = useTranslation(['home/aboutUsSection']);
    const [aboutUsContent, setAboutUsContent] = useState({ title: '', description: '', imageUrl: '' });

    useEffect(() => {
        const fetchAboutUsContent = async () => {
            try {
                const response = await axiosInstance.get('/about-us');
                const data = response.data;
                if (data.imagePath) {
                    try {
                        const imageResponse = await axiosInstance.get(`${axiosInstance.defaults.baseURL}/${data.imagePath}`, { responseType: 'blob' });
                        data.imageUrl = URL.createObjectURL(imageResponse.data);
                    } catch (error) {
                        console.error('Error fetching About Us image:', error);
                        data.imageUrl = "https://via.placeholder.com/400"; // Fallback image
                    }
                } else {
                    data.imageUrl = "https://via.placeholder.com/400"; // Fallback image
                }

                // Select content based on current language
                const lang = i18n.language; // Get the current language
                setAboutUsContent({
                    title: data[`title_${lang}`], // Dynamically access the title based on language
                    description: data[`description_${lang}`], // Dynamically access the description based on language
                    imageUrl: data.imageUrl
                });
            } catch (error) {
                console.error('Error fetching About Us content:', error);
            }
        };
        fetchAboutUsContent();
    }, [t, i18n]);

    return (
        <section className="aboutus-style-02">
            <div className="container">
                <div className="row flex items-center mt-8">
                    <div className="col-lg-6 col-xl-7 mt-8">
                        <div className="text-lg-center relative">
                            <div className="w-full max-w-md mx-auto overflow-hidden rounded-lg">
                                <img
                                    src={aboutUsContent.imageUrl}
                                    alt={t('altImage')}
                                    className="w-full h-auto object-cover rounded-lg shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-xl-5 mt-8">
                        <div className="section-heading text-start mb-0">
                            <span className="sub-title">{t('subTitle')}</span>
                        </div>
                        <h2 className="h1 mb-6 text-primary">{aboutUsContent.title}</h2>
                        <p className='mb-3'>{aboutUsContent.description}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUsSection;
