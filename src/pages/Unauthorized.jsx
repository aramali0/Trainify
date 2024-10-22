import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Unauthorized = () => {
    const { t } = useTranslation('auth/unauthorized');

    return (
        <section className="p-0">
            <div className="container d-flex flex-column">
                <div className="row align-items-center min-vh-100">
                    <div className="col-md-12">
                        <div className="wrapper-error position-relative my-3">
                            <div className="text-center">
                                <h1 className="mb-2 mb-sm-5 mb-lg-7">
                                    {t('unauthorized.title')}
                                </h1>
                                <h2 className="display-14 font-weight-800 mb-3">
                                    {t('unauthorized.heading')}
                                </h2>
                                <p className="mx-auto w-lg-60">
                                    {t('unauthorized.description')}
                                </p>
                                <div className="text-center">
                                    <Link to="/" className="butn md">
                                        <i className="fas fa-home icon-arrow md before"></i>
                                        <span className="label">{t('unauthorized.backToHome')}</span>
                                        <i className="fas fa-home icon-arrow after"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Unauthorized;
