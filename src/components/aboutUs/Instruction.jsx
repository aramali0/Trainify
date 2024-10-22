import React from 'react';
import team01Image from '../../assets/img/team/team-01.jpg';
import team02Image from '../../assets/img/team/team-02.jpg';
import team03Image from '../../assets/img/team/team-03.jpg';
import bg07Image from '../../assets/img/bg/bg-07.png';
import bg01Image from '../../assets/img/bg/bg-01.jpg';
import bg02Image from '../../assets/img/bg/bg-02.jpg';
import bg03Image from '../../assets/img/bg/bg-03.jpg';

const InstructorsSection = () => (
    <section className="position-relative">
        <div className="container">
            <div className="section-heading">
                <span className="sub-title">Instructors</span>
                <h2 className="h1 mb-0">Experience Instructors</h2>
            </div>
            <div className="row position-relative mt-n1-9">
                <div className="col-md-6 col-lg-4 mt-1-9">
                    <div className="team-style1 text-center">
                        <img src={team01Image} className="border-radius-5" alt="Murilo Souza" />
                        <div className="team-info">
                            <h3 className="text-primary mb-1 h4">Murilo Souza</h3>
                            <span className="font-weight-600 text-secondary">Web Designer</span>
                        </div>
                        <div className="team-overlay">
                            <div className="d-table h-100 w-100">
                                <div className="d-table-cell align-middle">
                                    <h3><a href="/instructors-details" className="text-white">About Murilo Souza</a></h3>
                                    <p className="text-white mb-0">I preserve each companion certification and I'm an authorized AWS solutions architect professional.</p>
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
                <div className="col-md-6 col-lg-4 mt-1-9">
                    <div className="team-style1 text-center">
                        <img src={team02Image} className="border-radius-5" alt="Balsam Samira" />
                        <div className="team-info">
                            <h3 className="text-primary mb-1 h4">Balsam Samira</h3>
                            <span className="font-weight-600 text-secondary">Photographer</span>
                        </div>
                        <div className="team-overlay">
                            <div className="d-table h-100 w-100">
                                <div className="d-table-cell align-middle">
                                    <h3><a href="/instructors-details" className="text-white">About Balsam Samira</a></h3>
                                    <p className="text-white mb-0">I preserve each companion certification and I'm an authorized AWS solutions architect professional.</p>
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
                <div className="col-md-6 col-lg-4 mt-1-9">
                    <div className="team-style1 text-center">
                        <img src={team03Image} className="border-radius-5" alt="Rodrigo Ribeiro" />
                        <div className="team-info">
                            <h3 className="text-primary mb-1 h4">Rodrigo Ribeiro</h3>
                            <span className="font-weight-600 text-secondary">Psychologist</span>
                        </div>
                        <div className="team-overlay">
                            <div className="d-table h-100 w-100">
                                <div className="d-table-cell align-middle">
                                    <h3><a href="/instructors-details" className="text-white">About Rodrigo Ribeiro</a></h3>
                                    <p className="text-white mb-0">I preserve each companion certification and I'm an authorized AWS solutions architect professional.</p>
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
                <div className="team-bg-shape">
                    <img src={bg07Image} alt="Background Shape" />
                </div>
            </div>
            <div className="shape18">
                <img src={bg01Image} alt="Shape" />
            </div>
            <div className="shape20">
                <img src={bg02Image} alt="Shape" />
            </div>
            <div className="shape21">
                <img src={bg03Image} alt="Shape" />
            </div>
        </div>
    </section>
);

export default InstructorsSection;

