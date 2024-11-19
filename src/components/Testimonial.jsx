import React from 'react';
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next';

// Import images
import avatar01 from '../assets/avatar/avatar1.jpg';
import avatar02 from '../assets/avatar/avatar2.jpg';
import avatar03 from '../assets/avatar/avatar3.jpg';
import avatar04 from '../assets/avatar/avatar4.jpg';
import avatar05 from '../assets/avatar/avatar5.jpg';
import avatar06 from '../assets/images/avatars/avatar-2.png';
import bg03 from '../assets/img/bg/bg-03.jpg';

const Testimonial = () => {
    const { t } = useTranslation(['home/testimonial']); // Use translation from "home/testimonial" namespace

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 5000,
        dotsClass: 'slick-dots custom-dots',
    };

    const testimonials = [
        {
            quote: t('testimonial.testimonial1'),
            name: t('testimonial.name1'),
            role: t('testimonial.role1'),
        },
        {
            quote: t('testimonial.testimonial2'),
            name: t('testimonial.name2'),
            role: t('testimonial.role2'),
        },
        {
            quote: t('testimonial.testimonial3'),
            name: t('testimonial.name3'),
            role: t('testimonial.role3'),
        },
    ];

    return (
        <section
            className="position-relative bg-dark text-light py-5"
            style={{
                backgroundImage: `url(${bg03})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
            }}
        >
            {/* Dark Overlay */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 1,
                }}
            ></div>

            {/* Main Content */}
            <div className="container position-relative" style={{ zIndex: 2 }}>
                {/* Section Heading */}
                <div className="section-heading text-center mb-5">
                    <span className="sub-title text-warning">{t('testimonial.subTitle')}</span>
                    <h2 className="h1 mb-0 text-light">{t('testimonial.title')}</h2>
                </div>

                {/* Testimonial Slider */}
                <div className="row justify-content-center">
                    <div className="col-lg-8 position-relative">
                        <Slider {...settings} className="testimonial-carousel text-center owl-carousel owl-theme">
                            {testimonials.map((testimonial, index) => (
                                <div key={index}>
                                    <p className="mb-4 lead text-light">{testimonial.quote}</p>
                                    <h6 className="mb-0 h5 text-warning">
                                        {testimonial.name} <small className="text-light"> - {testimonial.role}</small>
                                    </h6>
                                </div>
                            ))}
                        </Slider>

                        {/* Quotation Mark */}
                        <h6
                            className="testimonial-quote position-absolute text-warning"
                            style={{ fontSize: '60px', top: '-10px', left: '-30px' }}
                        >
                            “
                        </h6>
                    </div>
                </div>
            </div>

            {/* Floating Avatars */}
            <div className="position-relative" style={{ zIndex: 2 }}>
                <img
                    src={avatar01}
                    className="position-absolute bottom-15 left-20 d-none d-lg-block rounded-circle"
                    alt="Avatar 01"
                    style={{
                        width: '50px',
                        height: '50px',
                        boxShadow: '0px 4px 10px rgba(255, 255, 255, 0.4)',
                        filter: 'brightness(1.1)',
                        transition: 'transform 0.3s, filter 0.3s',
                    }}
                />
                <img
                    src={avatar02}
                    className="position-absolute bottom-40 left-10 d-none d-lg-block rounded-circle"
                    alt="Avatar 02"
                    style={{
                        width: '50px',
                        height: '50px',
                        boxShadow: '0px 4px 10px rgba(255, 255, 255, 0.4)',
                        filter: 'brightness(1.1)',
                        transition: 'transform 0.3s, filter 0.3s',
                    }}
                />
                <img
                    src={avatar03}
                    className="position-absolute left-20 top-20 d-none d-lg-block rounded-circle"
                    alt="Avatar 03"
                    style={{
                        width: '50px',
                        height: '50px',
                        boxShadow: '0px 4px 10px rgba(255, 255, 255, 0.4)',
                        filter: 'brightness(1.1)',
                        transition: 'transform 0.3s, filter 0.3s',
                    }}
                />
                <img
                    src={avatar04}
                    className="position-absolute top-45 right-10 d-none d-lg-block rounded-circle"
                    alt="Avatar 04"
                    style={{
                        width: '50px',
                        height: '50px',
                        boxShadow: '0px 4px 10px rgba(255, 255, 255, 0.4)',
                        filter: 'brightness(1.1)',
                        transition: 'transform 0.3s, filter 0.3s',
                    }}
                />
                <img
                    src={avatar05}
                    className="position-absolute top-25 right-26 d-none d-lg-block rounded-circle"
                    alt="Avatar 05"
                    style={{
                        width: '50px',
                        height: '50px',
                        boxShadow: '0px 4px 10px rgba(255, 255, 255, 0.4)',
                        filter: 'brightness(1.1)',
                        transition: 'transform 0.3s, filter 0.3s',
                    }}
                />
                <img
                    src={avatar06}
                    className="position-absolute bottom-15 right-15 d-none d-lg-block rounded-circle"
                    alt="Avatar 06"
                    style={{
                        width: '50px',
                        boxShadow: '0px 4px 10px rgba(255, 255, 255, 0.4)',
                        filter: 'brightness(1.1)',
                        transition: 'transform 0.3s, filter 0.3s',
                    }}
                />
            </div>

            {/* Background Shape */}
            <div className="shape21">
                <img
                    src={bg03}
                    alt="Background Shape"
                    style={{ filter: 'brightness(0.7)' }}
                />
            </div>

            <span className="process-left-shape d-none d-sm-block"></span>
        </section>
    );
};

export default Testimonial;
