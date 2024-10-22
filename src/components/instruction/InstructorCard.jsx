// src/components/InstructorCard.js
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const InstructorCard = ({ image, name, title, description }) => (
    <div className="col-lg-4 col-md-6 mb-1-6 mb-md-1-9">
        <div className="team-style1 text-center">
            <img src={image} className="border-radius-5" alt={name} />
            <div className="team-info">
                <h3 className="text-primary mb-1 h4">{name}</h3>
                <span className="font-weight-600 text-secondary">{title}</span>
            </div>
            <div className="team-overlay">
                <div className="d-table h-100 w-100">
                    <div className="d-table-cell align-middle">
                        <h3>
                            <Link to="/instructors-details" className="text-white">About {name}</Link>
                        </h3>
                        <p className="text-white mb-0">{description}</p>
                        <ul className="social-icon-style1">
                            <li><a href="#!"><i className="fab fa-facebook-f"></i></a></li>
                            <li><a href="#!"><i className="fab fa-twitter"></i></a></li>
                            <li><a href="#!"><i className="fab fa-youtube"></i></a></li>
                            <li><a href="#!"><i className="fab fa-linkedin-in"></i></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

InstructorCard.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
};

export default InstructorCard;
