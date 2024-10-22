import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DashboardCard = ({ title, count, imgSrc, link }) => {
    const { t, i18n } = useTranslation('pages/dashboardCard');

    // Check if the current language is Arabic (for RTL support)
    const isRtl = i18n.language === 'ar';

    return (
        <div className={`shadow rounded-lg bg-white dark:bg-default-50 ${isRtl ? 'rtl' : ''}`}>
            <div className="p-5">
                <div className="flex flex-col flex-wrap items-center justify-between">
                    <div>
                        <p className="text-base truncate font-semibold text-default-900">
                            {title}
                        </p>
                        <span className="inline-block text-2xl font-bold text-default-950 mt-3">{count}</span>
                    </div>
                    <span className="bg-default-200 rounded-lg flex items-center justify-center h-20 w-20 dark:bg-default-200/80">
                        <img src={imgSrc} alt={title} className="h-16" />
                    </span>
                </div>
                <Link to={link} className="relative inline-block tracking-wide align-middle text-sm text-primary duration-500 border-b border-primary mt-2">
                    {t('viewData')} <i className="h-4 w-4 inline align-middle ms-1" data-lucide="move-right"></i>
                </Link>
            </div>
        </div>
    );
};

export default DashboardCard;
