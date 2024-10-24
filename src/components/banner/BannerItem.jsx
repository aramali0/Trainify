import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../helper/axios';
import { useTranslation } from 'react-i18next';

const BannerItem = ({ backgroundImage, title, subtitle, link1, link2 }) => {

    const { t, i18n } = useTranslation(['home/banner']);

    return (
        <div
            className={`item bg-img cover-background pt-6 pb-10 pt-sm-6 pb-sm-14 py-md-16 py-lg-20 py-xxl-24 ${ i18n.language ==='ar' ?'right-overlay-dark' : 'left-overlay-dark'}`}
            data-overlay-dark="8"
            dir={i18n.dir()}

            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="container pt-6 pt-md-0">
                <div className="row align-items-center">
                    <div className="col-md-10 col-lg-8 col-xl-7 mb-1-9 mb-lg-0 py-6 position-relative mt-[200px]">
                        <span className="h5 text-secondary">{subtitle}</span>
                        <h2 className="display-1 font-weight-800 mb-2-6 title text-white">{title}</h2>
                        <Link to={link1.href} className="butn md my-1 mx-1">
                            <i className="fas fa-plus-circle icon-arrow before"></i>
                            <span className="label">{link1.text}</span>
                            <i className="fas fa-plus-circle icon-arrow after"></i>
                        </Link>
                        <Link to={link2.href} className="butn md white my-1">
                            <i className="fas fa-plus-circle icon-arrow before"></i>
                            <span className="label">{link2.text}</span>
                            <i className="fas fa-plus-circle icon-arrow after"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default BannerItem;
