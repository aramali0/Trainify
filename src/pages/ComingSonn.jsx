import React from 'react';
import { Link } from 'react-router-dom';
import bgImg from '../assets/img/bg/bg-08.jpg';
import logoInner from '../assets/img/logos/logo-inner.png';

const ComingSoon = () => {
    return (
        <section
            className="p-0 bg-img cover-background dark-overlay"
            style={{ backgroundImage: `url(${bgImg})` }}
            data-overlay-dark="6"
        >
            <div className="container d-flex flex-column position-relative z-index-9">
                <div className="row align-items-center min-vh-100 text-center justify-content-center">
                    <div className="col-xl-9">
                        <div className="my-1-6">
                            <div className="mb-1-6">
                                <img src={logoInner} alt="Company Logo" />
                            </div>
                            <div className="mb-1-6">
                                <h1 className="text-white display-5 font-weight-800">We are coming soon!</h1>
                                <p className="lead font-weight-400 mb-0 text-white">Stay tuned, we are launching very soon...</p>
                            </div>
                            <ul className="countdown d-md-flex justify-content-center align-items-center mb-1-9 mb-md-8 p-0">
                                <li className="text-white"><span className="days">00</span>
                                    <p className="timeRefDays text-center">days</p>
                                </li>
                                <li className="text-white"><span className="hours">00</span>
                                    <p className="timeRefHours">hours</p>
                                </li>
                                <li className="text-white"><span className="minutes">00</span>
                                    <p className="timeRefMinutes">minutes</p>
                                </li>
                                <li className="text-white"><span className="seconds">00</span>
                                    <p className="timeRefSeconds">seconds</p>
                                </li>
                            </ul>
                            <div className="row align-items-center text-white">
                                <div className="col-lg-8 mb-1-6 mb-lg-0">
                                    <div className="com-contact-info">
                                        <ul>
                                            <li><a href="#!" className="text-white"><i className="fas fa-phone-alt me-1"></i>+44 205-658-1823</a></li>
                                            <li><a href="#!" className="text-white"><i aria-hidden="true" className="fas fa-envelope-open-text me-2"></i>info@domain.com</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="social-icons">
                                        <ul>
                                            <li><a href="#!"><i className="fab fa-facebook-f"></i></a></li>
                                            <li><a href="#!"><i className="fab fa-twitter"></i></a></li>
                                            <li><a href="#!"><i className="fab fa-instagram"></i></a></li>
                                            <li><a href="#!"><i className="fab fa-youtube"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ComingSoon;
