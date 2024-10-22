// src/components/PortfolioInfo.js
import React from 'react';

const PortfolioInfo = () => (
    <div className="row bg-secondary border-radius-5 mb-1-9 p-1-9">
        <div className="col-sm-6 col-lg-3 mb-1-9 mb-lg-0">
            <div className="d-flex">
                <i className="ti-tag text-white display-18"></i>
                <div className="ms-3">
                    <h4 className="mb-1 h5 text-white">Category:</h4>
                    <span className="text-white opacity9">Other</span>
                </div>
            </div>
        </div>
        <div className="col-sm-6 col-lg-3 mb-1-9 mb-lg-0">
            <div className="d-flex">
                <i className="ti-user text-white display-18"></i>
                <div className="ms-3">
                    <h4 className="mb-1 h5 text-white">Client:</h4>
                    <span className="text-white opacity9">Casey Solano</span>
                </div>
            </div>
        </div>
        <div className="col-sm-6 col-lg-3 mb-1-9 mb-sm-0">
            <div className="d-flex">
                <i className="ti-timer text-white display-18"></i>
                <div className="ms-3">
                    <h4 className="mb-1 h5 text-white">Date:</h4>
                    <span className="text-white opacity9">12, Feb 2023</span>
                </div>
            </div>
        </div>
        <div className="col-sm-6 col-lg-3">
            <div className="d-flex">
                <i className="ti-money text-white display-18"></i>
                <div className="ms-3">
                    <h4 className="mb-1 h5 text-white">Cost:</h4>
                    <span className="text-white opacity9">$225.00</span>
                </div>
            </div>
        </div>
    </div>
);

export default PortfolioInfo;
