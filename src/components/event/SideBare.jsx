import React from 'react';

const Sidebar = () => {
    return (
        <div className="ps-lg-1-6 ps-xl-1-9">
            <div className="sidebar">
                <div className="widget">
                    <div className="widget-title">
                        <h3>Find Your Events</h3>
                    </div>
                    <form className="search">
                        <input type="text" placeholder="Search Your Courses" />
                        <button type="submit"><i className="fas fa-search"></i></button>
                    </form>
                </div>
                <div className="widget">
                    <div className="widget-title">
                        <h3>Event Information</h3>
                    </div>
                    <ul className="course-list">
                        <li><span><i className="ti-ticket pe-2"></i>Ticket Fee</span><span>$75.00</span></li>
                        <li><span><i className="ti-calendar pe-2"></i>Date</span><span>25 May, 2023</span></li>
                        <li><span><i className="ti-time pe-2"></i>Time</span><span>10:00 am to 6:00 pm</span></li>
                        <li><span><i className="ti-location-pin pe-2"></i>Place</span><span>23 Street, New York</span></li>
                        <li><span><i className="ti-medall pe-2"></i>Seat</span><span>Yes</span></li>
                        <li><span><i className="ti-world pe-2"></i>Language</span><span>English</span></li>
                    </ul>
                </div>
                <div className="widget">
                    <div className="widget-title">
                        <h3>Related Events</h3>
                    </div>
                    <div className="media mb-1-6">
                        <img className="pe-3 border-radius-5" src="img/content/course-list-insta-01.jpg" alt="Related Event" />
                        <div className="media-body align-self-center">
                            <h4 className="display-30 display-sm-29 font-weight-700 mb-1 text-capitalize"><a href="#!">Learn English Easily Programs</a></h4>
                            <span className="font-weight-700 display-30 display-md-29">Price: <span className="font-weight-800 display-30 display-md-29">$350</span></span>
                        </div>
                    </div>
                    <div className="media mb-1-6">
                        <img className="pe-3 border-radius-5" src="img/content/course-list-insta-02.jpg" alt="Related Event" />
                        <div className="media-body align-self-center">
                            <h4 className="display-30 display-sm-29 font-weight-700 mb-1 text-capitalize"><a href="#!">Unleash Power Of Animations</a></h4>
                            <span className="font-weight-700 display-30 display-md-29">Price: <span className="font-weight-800 display-30 display-md-29">$350</span></span>
                        </div>
                    </div>
                    <div className="media">
                        <img className="pe-3 border-radius-5" src="img/content/course-list-insta-01.jpg" alt="Related Event" />
                        <div className="media-body align-self-center">
                            <h4 className="display-30 display-sm-29 font-weight-700 mb-1 text-capitalize"><a href="#!">Healthy Code Review Mindset</a></h4>
                            <span className="font-weight-700 display-30 display-md-29">Price: <span className="font-weight-800 display-30 display-md-29">$350</span></span>
                        </div>
                    </div>
                </div>
                <div className="widget">
                    <div className="widget-title">
                        <h3>Share</h3>
                    </div>
                    <ul className="social-icons mb-0 ps-0">
                        <li><a href="#!"><i className="fab fa-facebook-f"></i></a></li>
                        <li><a href="#!"><i className="fab fa-twitter"></i></a></li>
                        <li><a href="#!"><i className="fab fa-instagram"></i></a></li>
                        <li><a href="#!"><i className="fab fa-youtube"></i></a></li>
                        <li><a href="#!"><i className="fab fa-linkedin-in"></i></a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
