import React from 'react'
import PageTitle from './PageTitle'
import AboutUsSection from '../components/aboutUs/AboutUs'
import ExtraSection from '../components/aboutUs/Extra'
import RegisterSection from '../components/aboutUs/Registration'
import { useTranslation } from 'react-i18next';


function AboutUs() {
    const { t } = useTranslation('aboutUs/aboutUsPage'); // Assuming you have translations for the AboutUs page

    return (
        <>
            <PageTitle title={t('title')} /> {/* Translated title */}
            <AboutUsSection />
            <ExtraSection />
            <RegisterSection />
        </>
    );
}

export default AboutUs;