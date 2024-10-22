import React from 'react';
import FAQSection from '../components/f&q/FAQSection';
import FAQForm from '../components/f&q/FAQForm';
import Header from '../components/Header';
import PageTitle from './PageTitle';
import Footer from '../components/Foooter';
import RegisterSection from '../components/aboutUs/Registration';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
const {t} = useTranslation('faq/faqPage'); // Assuming you have translations for the FAQ page

    return (
        <div>
            <PageTitle title={t('pageTitle')} />
            <FAQSection />
            <RegisterSection />
        </div>
    );
};

export default FAQ;
