import React from 'react';

// Import images
import process1 from '../assets/img/content/process-01.png';
import process2 from '../assets/img/content/process-02.png';
import process3 from '../assets/img/content/process-03.png';
import process4 from '../assets/img/content/process-04.png';

const Process = () => {
    return (
        <section>
            <div className="container">
                <div className="section-heading">
                    <span className="sub-title">process</span>
                    <h2 className="h1 mb-0">How It Works?</h2>
                </div>
                <div className="row">
                    <div className="process-wrapper">
                        <div className="process-background"></div>
                        <div className="process-content-wrapper">
                            <div className="row mt-n1-9">
                                <div className="col-lg-3 mt-1-9">
                                    <div className="process-content">
                                        <div className="mb-1-6 mb-lg-1-9">
                                            <img src={process1} alt="Students" />
                                        </div>
                                        <h3 className="h4">Students</h3>
                                        <p className="mb-0">
                                            Use of technology to empower individuals adapt anyplace and whenever.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-lg-3 mt-1-9">
                                    <div className="process-content">
                                        <div className="mb-1-6 mb-lg-1-9">
                                            <img src={process2} alt="Teachers" />
                                        </div>
                                        <h3 className="h4">Teachers</h3>
                                        <p className="mb-0">
                                            Use of technology to empower individuals adapt anyplace and whenever.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-lg-3 mt-1-9">
                                    <div className="process-content">
                                        <div className="mb-1-6 mb-lg-1-9">
                                            <img src={process3} alt="Helpful Staff" />
                                        </div>
                                        <h3 className="h4">Helpful Staff</h3>
                                        <p className="mb-0">
                                            Use of technology to empower individuals adapt anyplace and whenever.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-lg-3 mt-1-9">
                                    <div className="process-content">
                                        <div className="mb-1-6 mb-lg-1-9">
                                            <img src={process4} alt="Academic Staff" />
                                        </div>
                                        <h3 className="h4">Academic Staff</h3>
                                        <p className="mb-0">
                                            Use of technology to empower individuals adapt anyplace and whenever.
                                        </p>
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

export default Process;
