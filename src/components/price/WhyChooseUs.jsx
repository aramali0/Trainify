// src/components/WhyChooseUs.js
import React from 'react';
import whyChooseImg from '../../assets/img/content/why-choose-img.jpg';

const WhyChooseUs = () => (
    <section>
        <div className="container">
            <div className="row align-items-center mt-n1-9">
                <div className="col-lg-6 mt-1-9">
                    <div className="why-choose-img position-relative">
                        <img className="border-radius-5" src={whyChooseImg} alt="Why Choose Us" />
                        <div className="position-absolute top-50 start-50 translate-middle story-video">
                            <a className="video video_btn" href="https://www.youtube.com/watch?v=ZPs3URGs0KQ"><i className="fas fa-play font-size22"></i></a>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 mt-1-9">
                    <div className="why-choose-content">
                        <div className="mb-1-9">
                            <h2 className="h1 mb-2 text-primary">Our Facilities</h2>
                            <p className="mb-0">Lorem ipsum dolor sit amet consectetur adipisic sed eius to mod tempor incididunt.</p>
                        </div>
                        {[
                            { icon: 'ti-panel', title: 'Self Registration', description: 'A getting to know gadgets based totally on formalised coaching however with the assist of digital resources.' },
                            { icon: 'ti-package', title: 'Accreditation Support', description: 'A getting to know gadgets based totally on formalised coaching however with the assist of digital resources.' },
                            { icon: 'ti-bookmark-alt', title: 'Brand Integration', description: 'A getting to know gadgets based totally on formalised coaching however with the assist of digital resources.' }
                        ].map((item, index) => (
                            <div key={index}>
                                <div className="media">
                                    <i className={`${item.icon} display-15 text-secondary`}></i>
                                    <div className="media-body ps-3">
                                        <h4 className="h5 font-weight-700 mb-1 mb-md-2">{item.title}</h4>
                                        <p className="mb-0 w-lg-90">{item.description}</p>
                                    </div>
                                </div>
                                {index < 2 && <div className="dotted-seprator pt-1-9 mt-1-9"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default WhyChooseUs;
