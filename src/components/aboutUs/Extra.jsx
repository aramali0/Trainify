import React from 'react';
import { useTranslation } from 'react-i18next';
import about04Image from '../../assets/images/home/graduation.jpg';
import about05Image from '../../assets/images/home/partner.jpg';

const ExtraSection = () => {
    const { t } = useTranslation('aboutUs/extraSection'); // Assuming you have translations for ExtraSection

    return (
        <section className="py-0">
            <div className="row g-0">
                <div className="col-lg-6 order-2 order-lg-1">
                    <div className="instructor-partner-content h-100">
                        <h2 className="text-white h1 mb-3">{t('celebrateTitle')}</h2>
                        <p className="text-white">{t('celebrateDescription')}</p>
                        <a href="#!" className="butn md white">
                            <i className="fas fa-plus-circle icon-arrow before white"></i>
                            <span className="label">{t('applyNow')}</span>
                            <i className="fas fa-plus-circle icon-arrow after"></i>
                        </a>
                    </div>
                </div>
                <div className="col-lg-6 bg-img cover-background min-height order-1 order-lg-2" style={{ backgroundImage: `url(${about04Image})` }}></div>
            </div>
            <div className="row g-0">
                <div className="col-lg-6 bg-img cover-background min-height" style={{ backgroundImage: `url(${about05Image})` }}></div>
                <div className="col-lg-6">
                    <div className="instructor-content h-100">
                        <h2 className="h1 mb-3">{t('partnerTitle')}</h2>
                        <p>{t('partnerDescription')}</p>
                        <a href="#!" className="butn md">
                            <i className="fas fa-plus-circle md icon-arrow before"></i>
                            <span className="label">{t('applyNow')}</span>
                            <i className="fas fa-plus-circle md icon-arrow after"></i>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExtraSection;
