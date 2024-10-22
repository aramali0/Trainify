// src/App.js
import React from 'react';
import Header from '../components/Header';
import PageTitle from './PageTitle';
import Footer from '../components/Foooter';
import PricingSection from '../components/price/PricingSection';
import CounterSection from '../components/price/CouterSection';
import TestimonialSection from '../components/price/TestimonialSection';
import WhyChooseUs from '../components/WhyChooseUs';
import Counter from '../components/Counter';
import { useTranslation } from 'react-i18next';

function Pricing() {
    const { t } = useTranslation('pricing/pricingPage'); // Assuming you have translations for Pricing
    return (
        <div>
            <PageTitle title={t('pageTitle')} />
            <PricingSection />
            <WhyChooseUs />
            <Counter />
        </div>
    );
}

export default Pricing;
