import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Import images
import partner1 from '../assets/img/partners/partner-01.jpg';
import partner2 from '../assets/img/partners/partner-02.jpg';
import partner3 from '../assets/img/partners/partner-03.jpg';
import partner4 from '../assets/img/partners/partner-04.jpg';
import partner5 from '../assets/img/partners/partner-05.jpg';
import partner6 from '../assets/img/partners/partner-06.jpg';
import partner7 from '../assets/img/partners/partner-07.jpg';
import partner8 from '../assets/img/partners/partner-08.jpg';
import partner9 from '../assets/img/partners/partner-09.jpg';
import partner10 from '../assets/img/partners/partner-10.jpg';

const Partner = () => {
    // Carousel options
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 0,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <section className="bg-very-light-gray py-8">
            <div className="container">
                <Slider {...settings} className="client-carousel">
                    <div className="text-center">
                        <img src={partner1} alt="Partner 1" />
                    </div>
                    <div className="text-center">
                        <img src={partner2} alt="Partner 2" />
                    </div>
                    <div className="text-center">
                        <img src={partner3} alt="Partner 3" />
                    </div>
                    <div className="text-center">
                        <img src={partner4} alt="Partner 4" />
                    </div>
                    <div className="text-center">
                        <img src={partner5} alt="Partner 5" />
                    </div>
                    <div className="text-center">
                        <img src={partner6} alt="Partner 6" />
                    </div>
                    <div className="text-center">
                        <img src={partner7} alt="Partner 7" />
                    </div>
                    <div className="text-center">
                        <img src={partner8} alt="Partner 8" />
                    </div>
                    <div className="text-center">
                        <img src={partner9} alt="Partner 9" />
                    </div>
                    <div className="text-center">
                        <img src={partner10} alt="Partner 10" />
                    </div>
                </Slider>
            </div>
        </section>
    );
};

export default Partner;

