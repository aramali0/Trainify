import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const PageTitle = ({ title }) => {
    const { t } = useTranslation(['aboutUs/pageTitle']); // Set translation namespace

    return (
        <section className="page-title-section bg-img cover-background top-[-102px] left-overlay-dark" data-overlay-dark="9">
            <div className="container">
                <div className="row text-center">
                    <div className="col-md-12">
                        <h1>{title}</h1>
                    </div>
                    <div className="col-md-12">
                        <ul>
                            <li><Link to="/">{t('home')}</Link></li> {/* Home link */}
                            <li><Link to="/about">{t('aboutUs')}</Link></li> {/* About Us link */}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PageTitle;
