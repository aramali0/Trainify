import React, { useEffect, useState } from 'react';
import axiosInstance from '../../helper/axios';
import FAQTab from './FAQTAb';
import FAQAccordion from './FAQAccordion';
import { useTranslation } from 'react-i18next';

const FAQSection = () => {
    const { t } = useTranslation('faq/faqSection'); // Assuming you have translations for FAQ
    const [faqs, setFaqs] = useState({
        general: [],
        courses: [],
        subscription: [],
        pricing: [],
    });

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await axiosInstance.get('/contact-messages/faqs');
                const categorizedFaqs = categorizeFaqs(response.data);
                setFaqs(categorizedFaqs);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            }
        };

        fetchFaqs();
    }, []);

    const categorizeFaqs = (faqData) => {
        const categories = {
            general: [],
            courses: [],
            subscription: [],
            pricing: [],
        };

        faqData.forEach((faq) => {
            if (faq.subject.includes('course')) {
                categories.courses.push(faq);
            } else if (faq.subject.includes('subscription')) {
                categories.subscription.push(faq);
            } else if (faq.subject.includes('pricing')) {
                categories.pricing.push(faq);
            } else {
                categories.general.push(faq);
            }
        });

        return categories;
    };

    return (
        <section>
            <div className="container">
                <div className="section-heading">
                    <span className="sub-title">{t('subTitle')}</span>
                    <h2 className="h1 mb-0">{t('title')}</h2>
                </div>
                <div className="row">
                    <div className="col-md-10 mx-auto">
                        <div className="horizontaltab tab-style1">
                            <FAQTab />
                            <div className="resp-tabs-container hor_1">
                                {Object.keys(faqs).map((key) => (
                                    <FAQAccordion key={key} faqs={faqs[key]} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
