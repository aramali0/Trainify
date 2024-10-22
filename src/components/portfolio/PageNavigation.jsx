// src/components/PageNavigation.js
import React from 'react';
import PropTypes from 'prop-types';

const PageNavigation = ({ prevImg, nextImg }) => (
    <div className="page-navigation mt-6">
        <div className="prev-page">
            <div className="page-info">
                <a href="#!">
                    <span className="image-prev"><img src={prevImg} alt="Previous Portfolio" /></span>
                    <div className="prev-link-page-info">
                        <h4 className="prev-title">Create Animation</h4>
                        <span className="date-details"><span className="create-date">March 20, 2023</span></span>
                    </div>
                </a>
            </div>
        </div>
        <div className="next-page">
            <div className="page-info">
                <a href="#!">
                    <div className="next-link-page-info">
                        <h4 className="next-title">Business Research</h4>
                        <span className="date-details"><span className="create-date">March 27, 2023</span></span>
                    </div>
                    <span className="image-next"><img src={nextImg} alt="Next Portfolio" /></span>
                </a>
            </div>
        </div>
    </div>
);

PageNavigation.propTypes = {
    prevImg: PropTypes.string.isRequired,
    nextImg: PropTypes.string.isRequired
};

export default PageNavigation;
