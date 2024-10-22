import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Information = () => {
    const { t } = useTranslation(['home/information']);

    const services = [
        {
            icon: 'ti-rocket',
            title: t('learnAnything.title'),
            description: t('learnAnything.description'),
            link: {
                href: '/about',
                text: t('learnAnything.linkText')
            }
        },
        {
            icon: 'ti-world',
            title: t('learnTogether.title'),
            description: t('learnTogether.description'),
            link: {
                href: '/about',
                text: t('learnTogether.linkText')
            }
        },
        {
            icon: 'ti-user',
            title: t('learnExperts.title'),
            description: t('learnExperts.description'),
            link: {
                href: '/about',
                text: t('learnExperts.linkText')
            }
        }
    ];

    return (
        <section className="p-0 overflow-visible service-block">
            <div className="container">
                <div className="row mt-n1-9">
                    {services.map((service, index) => (
                        <div className="col-md-6 col-lg-4 mt-1-9" key={index}>
                            <div className="card card-style3 h-100">
                                <div className="card-body px-1-9 py-2-3">
                                    <div className="mb-3 d-flex align-items-center">
                                        <div className="card-icon">
                                            <i className={service.icon}></i>
                                        </div>
                                        <h4 className="ms-4 mb-0">{service.title}</h4>
                                    </div>
                                    <div>
                                        <p className="mb-3">{service.description}</p>
                                        <Link to={service.link.href} className="butn-style1 secondary">
                                            {service.link.text} +
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Information;
