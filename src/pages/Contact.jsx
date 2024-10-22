import React from 'react';
import ContactSection from '../components/contact/Contact';
import PageTitle from './PageTitle';
import { useTranslation } from 'react-i18next';

function Contact() {
    const { t } = useTranslation('contact/contact'); // Assuming you have translations for Contact

    return (
        <div className='main-wrapper'>
            <PageTitle title={t('pageTitle')} />
            <ContactSection />
        </div>
    );
}

export default Contact;
