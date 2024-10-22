// src/components/InstructorDetails.js
import React from 'react';
import PropTypes from 'prop-types';

const InstructorDetails = ({ name, description, courses, students, ratings, education, experience }) => (
    <div className="ps-lg-1-9 ps-xl-6">
        <div className="row mb-1-9 mb-xl-2-9">
            <div className="col-lg-12">
                <h4 className="teacher-name">{name}</h4>
                <p className="lead text-secondary font-weight-700">A certified instructor From eLearn</p>
                <h4 className="text-dark">About Me:</h4>
                <p className="alt-font text-color font-weight-500">{description}</p>
            </div>
        </div>
        <div className="row mb-1-9 mb-xl-2-9">
            <div className="col-lg-12">
                <ul className="course-info-list">
                    <li>
                        <h2 className="countup text-secondary font-weight-800 display-18">{courses}</h2>
                        <p className="alt-font font-weight-700 text-color display-30 mb-0">Courses</p>
                    </li>
                    <li>
                        <h2 className="countup text-secondary font-weight-800 display-18">{students}</h2>
                        <p className="alt-font font-weight-700 text-color display-30 mb-0">Students</p>
                    </li>
                    <li>
                        <h2 className="countup text-secondary font-weight-800 display-18">{ratings}</h2>
                        <p className="alt-font font-weight-700 text-color display-30 mb-0">Ratings</p>
                    </li>
                </ul>
            </div>
        </div>
        <div className="row">
            <div className="col-md-6 mb-1-6 mb-md-0 mb-lg-1-9 mb-lg-0">
                <h4 className="text-dark">Education:</h4>
                <ul className="instructor-details-info">
                    {education.map((edu, index) => (
                        <li key={index}>
                            <i className="ti-book"></i>
                            <p className="mb-0 text-primary font-weight-800 display-29">{edu.institution}</p>
                            <span className="text-color alt-font text-capitalize display-30">{edu.degree}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="col-md-6">
                <h4 className="text-dark">Experience:</h4>
                <ul className="instructor-details-info">
                    {experience.map((exp, index) => (
                        <li key={index}>
                            <i className="ti-briefcase"></i>
                            <p className="mb-0 text-primary font-weight-800 display-29">{exp.company}</p>
                            <span className="text-color alt-font text-capitalize display-30">{exp.duration}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

InstructorDetails.propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    courses: PropTypes.number.isRequired,
    students: PropTypes.number.isRequired,
    ratings: PropTypes.number.isRequired,
    education: PropTypes.arrayOf(
        PropTypes.shape({
            institution: PropTypes.string.isRequired,
            degree: PropTypes.string.isRequired
        })
    ).isRequired,
    experience: PropTypes.arrayOf(
        PropTypes.shape({
            company: PropTypes.string.isRequired,
            duration: PropTypes.string.isRequired
        })
    ).isRequired
};

export default InstructorDetails;
