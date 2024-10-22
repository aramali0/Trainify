import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const NotFound = () => {
    const { t, i18n } = useTranslation('pages/notfound'); // Initialize translation

    return (
        <>

            <section className="p-0" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="container d-flex flex-column">
                    <div className="row align-items-center min-vh-100">
                        <div className="col-md-12">
                            <div className="wrapper-error position-relative my-3">
                                <div className="text-center">
                                    <h1 className="mb-2 mb-sm-5 mb-lg-7">4<span className="text-primary">0</span>4</h1>
                                    <h2 className="display-14 font-weight-800 mb-3">{t('notFound.oops')}</h2>
                                    <p className="mx-auto w-lg-60">{t('notFound.message')}</p>
                                    <div className="text-center">
                                        <Link to="/" className="butn md">
                                            <i className="fas fa-home icon-arrow before"></i>
                                            <span className="label">{t('notFound.backToHome')}</span>
                                            <i className="fas fa-home icon-arrow after"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <a href="#!" className="scroll-to-top">
                <i className="fas fa-angle-up" aria-hidden="true"></i>
            </a>
        </>
    );
};

export default NotFound;
