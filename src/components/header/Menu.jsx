// src/components/Menu.js
import React from 'react';

const Menu = () => (
    <ul className="navbar-nav ms-auto" id="nav" style={{ display: 'none' }}>
        <li><a href="index.html">Home</a></li>
        <li>
            <a href="#!">Pages</a>
            <ul>
                <li><a href="about.html">About Us</a></li>
                <li><a href="instructors.html">Instructors</a></li>
                <li><a href="instructors-details.html">Instructors Details</a></li>
                <li><a href="pricing.html">Pricing</a></li>
                <li><a href="faq.html">FAQ</a></li>
                <li><a href="404.html">Page 404</a></li>
                <li><a href="coming-soon.html">Coming Soon</a></li>
            </ul>
        </li>
        <li>
            <a href="#!">Courses</a>
            <ul>
                <li><a href="courses-grid.html">Courses Grid</a></li>
                <li><a href="courses-list.html">Courses List</a></li>
                <li><a href="course-details.html">Courses Details</a></li>
            </ul>
        </li>
        <li>
            <a href="#!">Events</a>
            <ul>
                <li><a href="event-list.html">Event List</a></li>
                <li><a href="event-details.html">Event Details</a></li>
            </ul>
        </li>
        <li>
            <a href="#!">Portfolio</a>
            <ul>
                <li><a href="#!">Portfolio Grid</a>
                    <ul>
                        <li><a href="portfolio-two-columns.html">2 Columns</a></li>
                        <li><a href="portfolio.html">3 Columns - Standard</a></li>
                        <li><a href="portfolio-four-columns.html">4 Columns</a></li>
                    </ul>
                </li>
                <li><a href="portfolio-details.html">Portfolio Details</a></li>
            </ul>
        </li>
        <li>
            <a href="#!">Blog</a>
            <ul>
                <li><a href="blog-grid.html">Blog Grid</a>
                    <ul>
                        <li><a href="blog-grid-two-columns.html">2 Columns</a></li>
                        <li><a href="blog-grid-two-columns-left-sidebar.html">2 Col – Left Sidebar</a></li>
                        <li><a href="blog-grid-two-columns-right-sidebar.html">2 Col – Right Sidebar</a></li>
                        <li><a href="blog-grid.html">3 Columns - Standard</a></li>
                    </ul>
                </li>
                <li><a href="blog-list.html">Blog List</a></li>
                <li><a href="blog-details.html">Blog Details</a></li>
            </ul>
        </li>
        <li><a href="contact.html">Contact</a></li>
    </ul>
);

export default Menu;
