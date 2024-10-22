import React from 'react';
import { Link } from 'react-router-dom'; // For internal links if needed

// Import images
import team1 from '../assets/img/team/team-01.jpg';
import team2 from '../assets/img/team/team-02.jpg';
import team3 from '../assets/img/team/team-03.jpg';
import bgShape1 from '../assets/img/bg/bg-07.png';
import bgShape2 from '../assets/img/bg/bg-01.jpg';
import bgShape3 from '../assets/img/bg/bg-02.jpg';
import bgShape4 from '../assets/img/bg/bg-03.jpg';

const instructors = [
    {
        img: team1,
        name: 'Murilo Souza',
        role: 'Web Designer',
        description: 'I preserve each companion certification and I\'m an authorized AWS solutions architect professional.',
    },
    {
        img: team2,
        name: 'Balsam Samira',
        role: 'Photographer',
        description: 'I preserve each companion certification and I\'m an authorized AWS solutions architect professional.',
    },
    {
        img: team3,
        name: 'Rodrigo Ribeiro',
        role: 'Psychologist',
        description: 'I preserve each companion certification and I\'m an authorized AWS solutions architect professional.',
    }
];

const OnlineInstructors = () => {
    return (
        <section className="bg-very-light-gray position-relative">
            <div className="container">
                <div className="section-heading">
                    <span className="sub-title">Instructors</span>
                    <h2 className="h1 mb-0">Experience Instructors</h2>
                </div>
                <div className="row position-relative mt-n1-9">
                    {instructors.map((instructor, index) => (
                        <div className="col-md-6 col-lg-4 mt-1-9" key={index}>
                            <div className="team-style1 text-center">
                                <img src={instructor.img} className="border-radius-5" alt={instructor.name} />
                                <div className="team-info">
                                    <h3 className="text-primary mb-1 h4">{instructor.name}</h3>
                                    <span className="font-weight-600 text-secondary">{instructor.role}</span>
                                </div>
                                <div className="team-overlay">
                                    <div className="d-table h-100 w-100">
                                        <div className="d-table-cell align-middle">
                                            <h3><Link to="/instructors-details" className="text-white">About {instructor.name}</Link></h3>
                                            <p className="text-white mb-0">{instructor.description}</p>
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
                    ))}
                    <div className="team-bg-shape d-none d-xl-block">
                        <img src={bgShape1} alt="Background Shape 1" />
                    </div>
                </div>
                <div className="shape18">
                    <img src={bgShape2} alt="Background Shape 2" />
                </div>
                <div className="shape20">
                    <img src={bgShape3} alt="Background Shape 3" />
                </div>
                <div className="shape21">
                    <img src={bgShape4} alt="Background Shape 4" />
                </div>
            </div>
        </section>
    );
};

export default OnlineInstructors;
