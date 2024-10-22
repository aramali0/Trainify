// src/components/AttributeNav.js
import React from 'react';

const AttributeNav = () => (
    <div className="attr-nav align-items-xl-center ms-xl-auto main-font">
        <ul>
            <li className="search"><a href="#!"><i className="fas fa-search"></i></a></li>
            <li className="d-none d-xl-inline-block">
                <a href="contact.html" className="butn md text-white">
                    <i className="fas fa-plus-circle icon-arrow before"></i>
                    <span className="label">Apply Now</span>
                    <i className="fas fa-plus-circle icon-arrow after"></i>
                </a>
            </li>
        </ul>
    </div>
);

export default AttributeNav;
