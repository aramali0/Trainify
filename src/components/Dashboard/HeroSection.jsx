// src/components/Dashboard/HeroSection.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const HeroSection = ({
    titleKey = "hero.title",
    descriptionKey = "hero.description",
    buttonTextKey = "hero.buttonText",
    buttonLink = "#",
    imageSrc = "",
    nom = "",
}) => {
    const { t, i18n } = useTranslation('pages/heroSection'); // Initialize translation hook

    // Determine if the current language is Arabic for RTL support
    const isArabic = i18n.language === 'ar';

    return (
        <div className={`xl:col-span-2 ${isArabic ? 'text-right' : 'text-left'}`}>
            <div className="bg-primary/20 h-full rounded-lg shadow">
                <div className="p-6 h-full">
                    <div className="grid md:grid-cols-6 h-full gap-6">
                        <div className="md:col-span-4 h-full">
                            <div className={`flex flex-col items-${isArabic ? 'end' : 'start'} h-full`}>
                                <div className="grow">
                                    <h5 className="text-xl md:text-2xl lg:text-3xl font-bold text-default-900 mb-2">
                                        {t(titleKey)}
                                    </h5>
                                    <p className="text-sm md:text-base pr-5 md:pr-0 font-medium text-default-600 mb-6 max-w-sm">
                                        {t(descriptionKey)}
                                    </p>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                                    {(nom === "/responsable" || nom === "/charge-formation") && (
                                        <>
                                            <Link to={`${nom}/upload-certificate`}
                                                className="shrink mb-2 md:mb-0 py-2 px-4 md:px-5 inline-block font-semibold tracking-wide border duration-500 text-sm md:text-base text-center hover:bg-primary-700 border-green-400 hover:border-primary-700 bg-primary-700 text-primary-700 rounded-full"
                                            >
                                                {t('hero.uploadCertificate')}
                                            </Link>
                                            <Link to={`${nom}/add-user`}
                                                className="shrink mb-2 md:mb-0 py-2 px-4 md:px-5 inline-block font-semibold tracking-wide border duration-500 text-sm md:text-base text-center hover:bg-primary-700 border-green-400 hover:border-primary-700 bg-primary-700 text-primary-700 rounded-full"
                                            >
                                                {t('hero.addUser')}
                                            </Link>
                                        </>
                                    )}
                                    {buttonTextKey && nom !== "/admin" && (
                                        <a
                                            href={buttonLink || '#'}
                                            className="shrink h-10 md:h-11 py-2 px-4 md:px-5 inline-block font-semibold tracking-wide border duration-500 text-sm md:text-base text-center bg-primary hover:bg-primary-700 border-primary hover:border-primary-700 text-white rounded-full truncate"
                                        >
                                            {t(buttonTextKey)}
                                        </a>
                                    )}
                                    {nom === "/admin" && (
                                        <>
                                            <Link to="/admin/add-admin"
                                                className="shrink mb-4 md:mb-0 py-2 px-4 md:px-5 inline-block font-semibold tracking-wide border duration-500 text-sm md:text-base text-center hover:bg-primary-700 border-green-400 hover:border-primary-700 bg-primary-700 text-primary-700 rounded-full"
                                            >
                                                {t('hero.addAdmin')}
                                            </Link>
                                            <Link to="/admin/add-user"
                                                className="shrink h-10 md:h-11 py-2 px-4 md:px-5 inline-block font-semibold tracking-wide border duration-500 text-sm md:text-base text-center bg-primary hover:bg-primary-700 border-primary hover:border-primary-700 text-white rounded-full"
                                            >
                                                {t('hero.addUser')}
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <img src={imageSrc} alt={t('hero.heroImageAlt')} className="max-w-full h-full object-cover rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
