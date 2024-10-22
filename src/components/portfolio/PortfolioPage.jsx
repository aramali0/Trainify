// src/components/PortfolioDetails.js
import React from 'react';
import portfolioImg from '../../assets/img/portfolio/portfolio-details-01.jpg';
import prevImg from '../../assets/img/portfolio/prev-portfolio.jpg';
import nextImg from '../../assets/img/portfolio/next-portfolio.jpg';
import PageTitle from '../../pages/PageTitle';
import PortfolioInfo from './PortfolioInfo';
import ProjectOverview from './ProjectOverview';
import ProjectSummary from './ProjectSummer';
import ProjectChallenges from './ProjectChallenges';
import ProjectSolutions from './ProjectSolutions';
import PageNavigation from './PageNavigation';

const PortfolioDetails = () => (
    <div>
        <PageTitle />
        <section>
            <div className="container">
                <div className="col-12">
                    <div className="text-center mb-5">
                        <img src={portfolioImg} className="primary-shadow border-radius-5" alt="Portfolio" />
                    </div>
                    <PortfolioInfo />
                    <ProjectOverview />
                    <ProjectSummary />
                    <div className="row mt-n1-9">
                        <ProjectChallenges />
                        <ProjectSolutions />
                    </div>
                    <PageNavigation prevImg={prevImg} nextImg={nextImg} />
                </div>
            </div>
        </section>
    </div>
);

export default PortfolioDetails;
