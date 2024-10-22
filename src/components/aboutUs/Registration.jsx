import React, { useState } from 'react';
import axiosInstance from '../../helper/axios';
import bg05Image from '../../assets/images/home/bg-5.jpg';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const RegisterSection = () => {
    const { t } = useTranslation('aboutUs/registerSection'); // Assuming you have translations for RegisterSection

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        phone: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/contact-messages', formData);
            toast.success(t('successMessage')); // Translated success message
            setFormData({
                name: '',
                email: '',
                subject: '',
                phone: '',
                message: '',
            });
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error(t('errorMessage')); // Translated error message
        }
    };

    return (
        <section
            className="bg-img cover-background dark-overlay parallax md"
            style={{ backgroundImage: `url(${bg05Image})` }}
            data-overlay-dark="8"
        >
            <ToastContainer />
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-7 mb-1-9 mb-lg-0">
                        <div className="section-heading text-start">
                            <span className="sub-title white">{t('missionSubtitle')}</span>
                            <h2 className="h1 text-white">{t('missionTitle')}</h2>
                            <p className="text-white">{t('missionDescription')}</p>
                        </div>
                        <div className="row mb-5">
                            <div className="col-sm-4 mb-1-9 mb-sm-0">
                                <i className="ti-panel text-primary display-16 mb-3 d-block"></i>
                                <h4 className="mb-2 text-white h2">
                                    <span className="countup">{t('classesComplete')}</span>+
                                </h4>
                                <p className="mb-0 font-weight-600 text-white">{t('classesCompleteText')}</p>
                            </div>
                            <div className="col-sm-4 mb-1-9 mb-sm-0">
                                <i className="ti-book text-primary display-16 mb-3 d-block"></i>
                                <h4 className="mb-2 text-white h2">
                                    <span className="countup">{t('libraryBooks')}</span>k
                                </h4>
                                <p className="mb-0 font-weight-600 text-white">{t('libraryBooksText')}</p>
                            </div>
                            <div className="col-sm-4">
                                <i className="ti-medall text-primary display-16 mb-3 d-block"></i>
                                <h4 className="mb-2 text-white h3">
                                    <span className="countup">{t('certifiedTeachers')}</span>+
                                </h4>
                                <p className="mb-0 font-weight-600 text-white">{t('certifiedTeachersText')}</p>
                            </div>
                        </div>
                        <a href="/contact" className="butn md">
                            <i className="fas fa-plus-circle icon-arrow before"></i>
                            <span className="label">{t('applyNow')}</span>
                            <i className="fas fa-plus-circle icon-arrow after"></i>
                        </a>
                    </div>
                    <div className="col-lg-4 offset-lg-1">
                        <div className="card border-radius-5 border-0">
                            <div className="card-header bg-primary text-center py-4">
                                <h3 className="mb-0 text-white">{t('inquiryNow')}</h3>
                            </div>
                            <div className="card-body p-1-9">
                                <form className="contact quform" onSubmit={handleSubmit}>
                                    <div className="quform-elements">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="quform-element form-group">
                                                    <div className="quform-input">
                                                        <input
                                                            className="form-control"
                                                            id="name"
                                                            type="text"
                                                            name="name"
                                                            placeholder={t('namePlaceholder')}
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="quform-element form-group">
                                                    <div className="quform-input">
                                                        <input
                                                            className="form-control"
                                                            id="email"
                                                            type="email"
                                                            name="email"
                                                            placeholder={t('emailPlaceholder')}
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="quform-element form-group">
                                                    <div className="quform-input">
                                                        <input
                                                            className="form-control"
                                                            id="subject"
                                                            type="text"
                                                            name="subject"
                                                            placeholder={t('subjectPlaceholder')}
                                                            value={formData.subject}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="quform-element form-group">
                                                    <div className="quform-input">
                                                        <input
                                                            className="form-control"
                                                            id="phone"
                                                            type="text"
                                                            name="phone"
                                                            placeholder={t('phonePlaceholder')}
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="quform-element form-group">
                                                    <div className="quform-input">
                                                        <textarea
                                                            className="form-control"
                                                            id="message"
                                                            name="message"
                                                            rows="3"
                                                            placeholder={t('messagePlaceholder')}
                                                            value={formData.message}
                                                            onChange={handleChange}
                                                            required
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="quform-submit-inner">
                                            <button className="btn btn-primary d-block w-100" type="submit">
                                                {t('submitButton')}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RegisterSection;
