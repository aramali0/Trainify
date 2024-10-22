// src/components/InstructorSkills.js
import React from 'react';
import PropTypes from 'prop-types';

const InstructorSkills = ({ skills }) => (
    <div className="row mb-1-9 mb-xl-2-9">
        <h4 className="text-dark mb-3">Our Instructor Skill:</h4>
        <p className="alt-font font-weight-500 text-color">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
        {skills.map((skill, index) => (
            <div className="col-md-6 mb-1-6" key={index}>
                <div className="progress-text">
                    <div className="row">
                        <div className="col-7">{skill.name}</div>
                        <div className="col-5 text-end">{skill.percentage}%</div>
                    </div>
                </div>
                <div className="progress progress-medium">
                    <div className="animated custom-bar progress-bar slideInLeft" style={{ width: `${skill.percentage}%` }} aria-valuemax="100" aria-valuemin="0" aria-valuenow="10" role="progressbar"></div>
                </div>
            </div>
        ))}
    </div>
);

InstructorSkills.propTypes = {
    skills: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            percentage: PropTypes.number.isRequired
        })
    ).isRequired
};

export default InstructorSkills;
