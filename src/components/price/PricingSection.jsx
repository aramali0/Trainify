import React, { useEffect, useState } from 'react';
import PricingCard from './PricingCard';
import axiosInstance from '../../helper/axios';
import { useTranslation } from 'react-i18next';

const PricingSection = () => {
    const { t, i18n } = useTranslation('pricing/pricingSection'); // Using i18n for language detection
    const [pricingPlans, setPricingPlans] = useState([]);

    useEffect(() => {
        const fetchPricingPlans = async () => {
            try {
                const response = await axiosInstance.get('/pricing');
                const language = i18n.language; // Detect the current language (e.g., 'ar', 'fr', 'en')

                // Map the plans based on the language
                const mappedPlans = response.data.map(plan => {
                    let translatedPlan, translatedFeatures;

                    if (language === 'ar') {
                        translatedPlan = plan.planAR;
                        translatedFeatures = plan.featuresAR;
                    } else if (language === 'fr') {
                        translatedPlan = plan.planFR;
                        translatedFeatures = plan.featuresFR;
                    } else {
                        translatedPlan = plan.planEN;
                        translatedFeatures = plan.featuresEN;
                    }

                    return {
                        ...plan,
                        translatedPlan,
                        translatedFeatures,
                        price: plan.price + " MAD" // Keep price consistent
                    };
                });

                setPricingPlans(mappedPlans);
            } catch (error) {
                console.error('Error fetching pricing plans:', error);
            }
        };

        fetchPricingPlans();
    }, [i18n.language]); // Refetch when language changes

    return (
        <section className="bg-light">
            <div className="container">
                <div className="section-heading">
                    <span className="sub-title">{t('subTitle')}</span>
                    <h2 className="h1 mb-0">{t('title')}</h2>
                </div>
                <div className="row align-items-center g-xl-5 mt-n1-9">
                    {pricingPlans.map((plan, index) => (
                        <PricingCard key={index} plan={plan.translatedPlan} features={plan.translatedFeatures} price={plan.price} per={plan.per} link={plan.link} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
