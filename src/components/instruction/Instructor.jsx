// src/components/Instructor.js
import React from 'react';
import teamImage from '../../assets/img/team/team-02.jpg';
import InstructorImage from './InstructorImage';
import InstructorDetails from './InstructorDetails';
import InstructorSkills from './IstructorSkill';

const Instructor = () => {
    const education = [
        { institution: 'Harvard University', degree: 'Bachelor in Mathematics' },
        { institution: 'University of Toronto', degree: 'Bachelor in English' }
    ];

    const experience = [
        { company: 'Harvard University', duration: '2021 - 2022' },
        { company: 'University of Toronto', duration: '2022 - 2023' }
    ];

    const skills = [
        { name: 'Accounting', percentage: 95 },
        { name: 'Mathematics', percentage: 90 },
        // Add more skills as needed
    ];

    return (
        <section>
            <div className="container">
                <div className="row mb-1-9 mb-xl-2-9">
                    <div className="col-lg-5 mb-1-9 mb-md-2-5 mb-lg-0">
                        <InstructorImage
                            src={teamImage}
                            alt="Balsam Samira"
                            name="Balsam Samira"
                            email="info@yourwebsite.com"
                            phone="+44 205-658-1823"
                        />
                    </div>
                    <div className="col-lg-7">
                        <InstructorDetails
                            name="Eliena Rose"
                            description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat..."
                            courses={12}
                            students={120}
                            ratings={4.5}
                            education={education}
                            experience={experience}
                        />
                    </div>
                </div>
                <InstructorSkills skills={skills} />
            </div>
        </section>
    );
};

export default Instructor;
