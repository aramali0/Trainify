// src/components/PortfolioItem.js
import React from 'react';
import PropTypes from 'prop-types';

const PortfolioItem = ({ imgSrc, title, link }) => (
    <div className="col-md-6 col-xl-4 mt-1-9" data-src={imgSrc} data-sub-html={`<h4 class='text-white'>${title}</h4>`}>
        <div className="portfolio-wrapper">
            <img className="border-radius-5" src={imgSrc} alt={title} />
            <div className="portfolio-overlay">
                <div className="portfolio-content">
                    <a className="popimg me-2" href={imgSrc}><i className="ti-zoom-in"></i></a>
                    <a href={link} className="portfolio-link"><i className="ti-link"></i></a>
                    <h4 className="mb-0 text-white">{title}</h4>
                </div>
            </div>
        </div>
    </div>
);

PortfolioItem.propTypes = {
    imgSrc: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
};

export default PortfolioItem;
