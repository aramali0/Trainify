import React from 'react';
import Banner from '../components/Banner';
import Information from '../components/Information';
import OnlineCourses from '../components/OnlineCourses';
import TrendingCategories from '../components/TredingCategories';
import WhyChooseUs from '../components/WhyChooseUs';
import Counter from '../components/Counter';
import Testimonial from '../components/Testimonial';
import UpcomingEvents from '../components/UpComingEvents';
import AboutUsSection from '../components/aboutUs/AboutUs';

const Home = () => {
    return (
        <div className='main-wrapper'>
            <Banner />
            <Information />
            <AboutUsSection />
            <OnlineCourses />
            <TrendingCategories />
            <WhyChooseUs />
            <Counter />
            <Testimonial />
            <UpcomingEvents />
        </div>
    );
};

export default Home;
