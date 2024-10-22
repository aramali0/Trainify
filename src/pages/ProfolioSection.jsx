// src/components/PortfolioSection.js
import React from 'react';
import portfolioImg1 from '../assets/img/portfolio/portfolio-01.jpg';
import portfolioImg2 from '../assets/img/portfolio/portfolio-02.jpg';
import portfolioImg3 from '../assets/img/portfolio/portfolio-03.jpg';
import portfolioImg4 from '../assets/img/portfolio/portfolio-04.jpg';
import portfolioImg5 from '../assets/img/portfolio/portfolio-05.jpg';
import portfolioImg6 from '../assets/img/portfolio/portfolio-06.jpg';
import PortfolioItem from '../components/portfolio/PortfilioItem';
import Header from '../components/Header';
import PageTitle from './PageTitle';
import Footer from '../components/Foooter';

const portfolioItems = [
    { imgSrc: portfolioImg1, title: 'Design & Typography', link: 'portfolio-details.html' },
    { imgSrc: portfolioImg2, title: 'Business Research', link: 'portfolio-details.html' },
    { imgSrc: portfolioImg3, title: 'Software Development', link: 'portfolio-details.html' },
    { imgSrc: portfolioImg4, title: 'Graphic Design', link: 'portfolio-details.html' },
    { imgSrc: portfolioImg5, title: 'Learning Languages', link: 'portfolio-details.html' },
    { imgSrc: portfolioImg6, title: 'Create Animation', link: 'portfolio-details.html' },
];

const PortfolioSection = () => (
    <div>
        <PageTitle />
        <section>
            <div className="container">
                <div className="section-heading">
                    <span className="sub-title">Discover New</span>
                    <h2 className="h1 mb-0">Our Portfolio</h2>
                </div>
                <div className="row mt-n1-9 portfolio-gallery">
                    {portfolioItems.map((item, index) => (
                        <PortfolioItem key={index} imgSrc={item.imgSrc} title={item.title} link={item.link} />
                    ))}
                </div>
            </div>
        </section>
    </div>
);

export default PortfolioSection;
