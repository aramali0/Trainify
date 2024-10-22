import React, { useEffect, useState } from 'react';
import BannerItem from './banner/BannerItem';
import axiosInstance from '../helper/axios';
import { useTranslation } from 'react-i18next';

const Banner = () => {
    const { t,i18n } = useTranslation(['home/banner']);
    const [bannerItems, setBannerItems] = useState([]);

   useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await axiosInstance.get('/banners');
                setBannerItems(response.data);
            } catch (error) {
                console.error('Error fetching banners:', error);
            }
        };

        fetchBanners();
    }, [i18n.language]); //

    useEffect(() => {
        // Initialize Owl Carousel after the bannerItems are set
        if (bannerItems.length) {
            $('.slider-fade1').owlCarousel({
                items: 1,
                loop: true,
                margin: 0,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                smartSpeed: 1000,
                fadeOut: true, // For fade effect
            });
        }

        // Cleanup function to destroy Owl Carousel instance
        return () => {
            $('.slider-fade1').trigger('destroy.owl.carousel');
        };
    }, [bannerItems]);

    return (
        <section className="top-[-102px] left-0 p-0">
            <div className="container-fluid px-0 mb-4">
                <div className="slider-fade1 owl-carousel owl-theme w-100 mb-7 ">
                    {bannerItems.map((item, index) => (
                        <BannerItem
                            key={item.id}
                            backgroundImage={item.backgroundImage}
                            title={item.title}
                            subtitle={item.subtitle}
                            link1={item.link1Href ? { href: item.link1Href, text: item.link1Text } : null}
                            link2={item.link2Href ? { href: item.link2Href, text: item.link2Text } : null}
                        />
                    ))}
                </div>
            </div>
            <div className="triangle-shape top-15 right-10 z-index-9 d-none d-md-block"></div>
            <div className="square-shape top-25 left-5 z-index-9 d-none d-xl-block"></div>
            <div className="shape-five z-index-9 right-10 bottom-15"></div>
        </section>
    );
};

export default Banner;
