import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RegisterSection from '../aboutUs/Registration';
import axiosInstance from '../../helper/axios';
import { useTranslation } from 'react-i18next';

const ContactSection = () => {
    const { t } = useTranslation('contact/contactSection'); // Assuming you have translations for ContactSection
    const [contactInfo, setContactInfo] = useState({
        email: '',
        location: '',
        phone: '',
    });

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const response = await axiosInstance.get('/contact-info');
                setContactInfo(response.data);
            } catch (error) {
                console.error('Error fetching contact info:', error);
            }
        };

        fetchContactInfo();
    }, []);

    return (
        <>
            {/* QUICK CONTACT */}
            <section className="contact-form pb-0">
                <div className="container mb-2-9 mb-md-6 mb-lg-7">
                    <div className="section-heading">
                        <span className="sub-title">{t('subTitle')}</span>
                        <h2 className="mb-9 display-16 display-sm-14 display-lg-10 font-weight-800">{t('title')}</h2>
                        <div className="heading-seperator"><span></span></div>
                    </div>
                    <div className="row mt-n2-9 mb-md-6 mb-lg-7">
                        <div className="col-lg-4 mt-2-9">
                            <div className="contact-wrapper bg-light rounded position-relative h-100 px-4">
                                <div className="mb-4">
                                    <i className="contact-icon ti-email"></i>
                                </div>
                                <div>
                                    <h4>{t('emailHeader')}</h4>
                                    <ul className="list-unstyled p-0 m-0">
                                        <li><Link to={`mailto:${contactInfo.email}`}>{contactInfo.email}</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 mt-2-9">
                            <div className="contact-wrapper bg-light rounded position-relative h-100 px-4">
                                <div className="mb-4">
                                    <i className="contact-icon ti-map-alt"></i>
                                </div>
                                <div>
                                    <h4>{t('locationHeader')}</h4>
                                    <ul className="list-unstyled p-0 m-0">
                                        <li>{contactInfo.location}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 mt-2-9">
                            <div className="contact-wrapper bg-light rounded position-relative h-100 px-4">
                                <div className="mb-4">
                                    <i className="contact-icon ti-mobile"></i>
                                </div>
                                <div>
                                    <h4>{t('phoneHeader')}</h4>
                                    <ul className="list-unstyled p-0 m-0">
                                        <li><Link to={`tel:${contactInfo.phone}`}>{contactInfo.phone}</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <RegisterSection />
            <section className="p-0">
                <iframe
                    width="100%"
                    height="500"
                    id="gmap_canvas"
                    src="https://maps.google.com/maps?q=london&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    title="Google Map"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                ></iframe>
            </section>
        </>
    );
};

export default ContactSection;
