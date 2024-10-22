// src/components/InstructorImage.js
import React from 'react';
import PropTypes from 'prop-types';

const InstructorImage = ({ src, alt, name, email, phone }) => (
    <div className="instructor-img-wrapper mb-50 md-mb-0">
        <div className="mb-1-6 mb-xl-1-9">
            <img className="border-radius-5" src={src} alt={alt} />
        </div>
        <div className="text-center">
            <h3 className="font-weight-800 display-26 display-md-25 display-xl-24 text-primary">{name}</h3>
            <p className="alt-font text-secondary font-weight-700 mb-2">Chief Instructor</p>
            <ul className="personal-info">
                <li>
                    <i className="ti-email"></i>
                    <a href={`mailto:${email}`} className="text-primary">{email}</a>
                </li>
                <li>
                    <i className="ti-mobile"></i>
                    <a href={`tel:${phone}`} className="text-primary">{phone}</a>
                </li>
            </ul>
        </div>
        <ul className="social-box">
            <li><a href="#!"><i className="fab fa-facebook-f"></i></a></li>
            <li><a href="#!"><i className="fab fa-twitter"></i></a></li>
            <li><a href="#!"><i className="fab fa-instagram"></i></a></li>
            <li><a href="#!"><i className="fab fa-youtube"></i></a></li>
            <li><a href="#!"><i className="fab fa-linkedin-in"></i></a></li>
        </ul>
    </div>
);

InstructorImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired
};

export default InstructorImage;
