import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import footerLogo from '../assets/ehc_logo.svg';
import insta1 from '../assets/agile.jpg';
import insta2 from '../assets/team.jpg';
import LanguageSelector from './Dashboard/LanguageSelector';

const Footer = () => {
  const { t } = useTranslation('footer/footer');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
  };

  return (
    <footer className="bg-dark pb-6">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-lg-3 mt-12">
            <Link to="/" className="footer-logo">
              <img src={footerLogo} className="mb-4 ml-16 h-[150px] flex justify-center" alt="Footer Logo" />
            </Link>
            <p className="mb-1-6 text-white">{t('footerText')}</p>
            {/* <form className="quform newsletter" onSubmit={handleSubmit}>
              <div className="quform-elements">
                <div className="row">
                  <div className="col-md-12">
                    <div className="quform-element mb-0">
                      <div className="quform-input">
                        <input
                          className="form-control"
                          id="email_address"
                          type="text"
                          name="email_address"
                          placeholder={t('subscribePlaceholder')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="quform-submit-inner">
                      <button className="btn btn-white text-primary m-0 px-2" type="submit">
                        <i className="fas fa-paper-plane"></i> {t('submitBtn')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form> */}

          </div>

          <div className="col-md-6 col-lg-2 mb-4-5 mb-lg-0">
            <h3 className="text-primary h5 mb-2-2">{t('aboutUs')}</h3>
            <ul className="footer-list mt-[55px]">
              <li><Link to="/about">{t('aboutUs')}</Link></li>
              <li><Link to="/courses-list">{t('Formations')}</Link></li>
              <li><Link to="/instructors">{t('instructor')}</Link></li>
              <li><Link to="/event-list">{t('event')}</Link></li>
            </ul>
          </div>

          <div className="col-md-6 col-lg-2 mb-4-5 mb-lg-0">
            <h3 className="text-primary h5 mb-2-2">{t('newsBlogs')}</h3>
            <ul className="footer-list mt-[55px]">
              <li><Link to="/blog-grid">{t('newsBlogs')}</Link></li>
              <li><Link to="/portfolio">{t('portfolio')}</Link></li>
              <li><Link to="/faq">{t('faq')}</Link></li>
              <li><Link to="/contact">{t('contact')}</Link></li>
            </ul>
          </div>

          <div className="col-md-6 col-lg-4">
            <h3 className="text-primary h5 mb-2-2">{t('popularCourses')}</h3>
            <div className="media footer-border">
              <img className="pe-3 border-radius-5 h-[80px] w-[80px]" src={insta1} alt="Popular Course 1" />
              <div className="media-body align-self-center">
                <h4 className="h6 mb-2">
                  <Link to="/blog-details" className="text-white text-primary-hover">{t('course1')}</Link>
                </h4>
                <span className="text-white small">Mar. 30, 2023</span>
              </div>
            </div>
            <div className="media">
              <img className="pe-3 border-radius-5 h-[80px] w-[80px]" src={insta2} alt="Popular Course 2" />
              <div className="media-body align-self-center">
                <h4 className="h6 mb-2">
                  <Link to="/blog-details" className="text-white text-primary-hover">{t('course2')}</Link>
                </h4>
                <span className="text-white small">Mar. 28, 2023</span>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="footer-bar text-center">
          <p className="mb-0 text-white font-weight-500">
            &copy; <span>{new Date().getFullYear()}</span> {t('copyright')}
          </p>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;