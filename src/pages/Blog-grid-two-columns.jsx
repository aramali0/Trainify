import React from 'react';
import { Link } from 'react-router-dom';
import blog01 from '../assets/img/blog/blog-01.jpg';
import blog02 from '../assets/img/blog/blog-02.jpg';
import blog03 from '../assets/img/blog/blog-03.jpg';
import blog04 from '../assets/img/blog/blog-04.jpg';
import blog05 from '../assets/img/blog/blog-05.jpg';
import blog06 from '../assets/img/blog/blog-06.jpg';
import courseListInsta01 from '../assets/img/content/course-list-insta-01.jpg';
import courseListInsta02 from '../assets/img/content/course-list-insta-02.jpg';
import Header from '../components/Header';
import Footer from '../components/Foooter';

const Blog = () => {
    return (
        <>
            <Header />
            <section className="blog">
                <div className="container">
                    <div className="row mt-n2-9">
                        <div className="col-lg-4 mt-2-9 order-2 order-lg-1">
                            <div className="pe-lg-1-6 pe-xl-1-9">
                                <div className="sidebar">
                                    <div className="widget">
                                        <div className="widget-title">
                                            <h3>Search</h3>
                                        </div>
                                        <form className="search">
                                            <input type="text" placeholder="Search Your Courses" />
                                            <button type="submit"><i className="fas fa-search"></i></button>
                                        </form>
                                    </div>
                                    <div className="widget">
                                        <div className="widget-title">
                                            <h3>Course Categories</h3>
                                        </div>
                                        <ul className="category-list">
                                            <li><Link to="#!">Java Programming<span>10</span></Link></li>
                                            <li><Link to="#!">Business Management<span>05</span></Link></li>
                                            <li><Link to="#!">Online Learning<span>15</span></Link></li>
                                            <li><Link to="#!">Web Designing<span>20</span></Link></li>
                                            <li><Link to="#!">English Learning<span>25</span></Link></li>
                                            <li><Link to="#!">Animation<span>40</span></Link></li>
                                        </ul>
                                    </div>
                                    <div className="widget">
                                        <div className="widget-title">
                                            <h3>Recent Articles</h3>
                                        </div>
                                        <div className="media mb-1-6">
                                            <img className="pe-3 border-radius-5" src={courseListInsta01} alt="..." />
                                            <div className="media-body align-self-center">
                                                <h4 className="display-30 display-sm-29 font-weight-700 mb-1 text-capitalize"><Link to="#!">Learn English Easily Programs</Link></h4>
                                                <span className="font-weight-700 display-30 display-md-29">Price: <span className="font-weight-800 display-30 display-md-29">$350</span></span>
                                            </div>
                                        </div>
                                        <div className="media mb-1-6">
                                            <img className="pe-3 border-radius-5" src={courseListInsta02} alt="..." />
                                            <div className="media-body align-self-center">
                                                <h4 className="display-30 display-sm-29 font-weight-700 mb-1 text-capitalize"><Link to="#!">Unleash Power Of Animations</Link></h4>
                                                <span className="font-weight-700 display-30 display-md-29">Price: <span className="font-weight-800 display-30 display-md-29">$350</span></span>
                                            </div>
                                        </div>
                                        <div className="media">
                                            <img className="pe-3 border-radius-5" src={courseListInsta01} alt="..." />
                                            <div className="media-body align-self-center">
                                                <h4 className="display-30 display-sm-29 font-weight-700 mb-1 text-capitalize"><Link to="#!">Healthy Code Review Mindset</Link></h4>
                                                <span className="font-weight-700 display-30 display-md-29">Price: <span className="font-weight-800 display-30 display-md-29">$350</span></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widget">
                                        <div className="widget-title">
                                            <h3>Popular Tags</h3>
                                        </div>
                                        <ul className="course-tags">
                                            <li><Link to="#!">Business</Link></li>
                                            <li><Link to="#!">Courses</Link></li>
                                            <li><Link to="#!">Guides</Link></li>
                                            <li><Link to="#!">Tips</Link></li>
                                            <li><Link to="#!">Education</Link></li>
                                            <li><Link to="#!">Marketing</Link></li>
                                            <li><Link to="#!">Technology</Link></li>
                                        </ul>
                                    </div>
                                    <div className="widget">
                                        <div className="widget-title">
                                            <h3>Share</h3>
                                        </div>
                                        <ul className="social-icons mb-0 ps-0">
                                            <li><Link to="#!"><i className="fab fa-facebook-f"></i></Link></li>
                                            <li><Link to="#!"><i className="fab fa-twitter"></i></Link></li>
                                            <li><Link to="#!"><i className="fab fa-instagram"></i></Link></li>
                                            <li><Link to="#!"><i className="fab fa-youtube"></i></Link></li>
                                            <li><Link to="#!"><i className="fab fa-linkedin-in"></i></Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12 col-lg-8 mt-2-9 order-1 order-lg-2">
                            <div className="row mt-n2-6">
                                <div className="col-md-6 mt-2-6">
                                    <article className="blog-style1 position-relative d-block mb-0">
                                        <div className="img-holder position-relative d-block">
                                            <div className="image-hover">
                                                <img src={blog01} alt="..." />
                                            </div>
                                        </div>
                                        <div className="text-holder">
                                            <div className="category-box">
                                                <Link to="#!">creative</Link>
                                            </div>
                                            <h3 className="display-25 font-weight-700 mb-3"><Link to="blog-details.html">Skills that you can learn from eLearn.</Link></h3>
                                            <div><p>Duty obligations of business frequently occur pleasures enjoy...</p></div>
                                            <div className="bottom-box">
                                                <div className="btn-box">
                                                    <Link to="blog-details.html">
                                                        <span className="icon-right-arrow-1"></span>Read More
                                                    </Link>
                                                </div>
                                                <ul className="mb-0 ps-0">
                                                    <li><span className="icon-calendar"></span>6 Jul 2023</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                                <div className="col-md-6 mt-2-6">
                                    <article className="blog-style1 position-relative d-block mb-0">
                                        <div className="img-holder position-relative d-block">
                                            <div className="image-hover">
                                                <img src={blog02} alt="..." />
                                            </div>
                                        </div>
                                        <div className="text-holder">
                                            <div className="category-box">
                                                <Link to="#!">Learning</Link>
                                            </div>
                                            <h3 className="display-25 font-weight-700 mb-3"><Link to="blog-details.html">Is eLearn any good? 7 ways you can be certain.</Link></h3>
                                            <div><p>Duty obligations of business frequently occur pleasures enjoy...</p></div>
                                            <div className="bottom-box">
                                                <div className="btn-box">
                                                    <Link to="blog-details.html">
                                                        <span className="icon-right-arrow-1"></span>Read More
                                                    </Link>
                                                </div>
                                                <ul className="mb-0 ps-0">
                                                    <li><span className="icon-calendar"></span>4 Jul 2023</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                                <div className="col-md-6 mt-2-6">
                                    <article className="blog-style1 position-relative d-block mb-0">
                                        <div className="img-holder position-relative d-block">
                                            <div className="image-hover">
                                                <img src={blog03} alt="..." />
                                            </div>
                                        </div>
                                        <div className="text-holder">
                                            <div className="category-box">
                                                <Link to="#!">Career</Link>
                                            </div>
                                            <h3 className="display-25 font-weight-700 mb-3"><Link to="blog-details.html">How will eLearn be in the future.</Link></h3>
                                            <div><p>Duty obligations of business frequently occur pleasures enjoy...</p></div>
                                            <div className="bottom-box">
                                                <div className="btn-box">
                                                    <Link to="blog-details.html">
                                                        <span className="icon-right-arrow-1"></span>Read More
                                                    </Link>
                                                </div>
                                                <ul className="mb-0 ps-0">
                                                    <li><span className="icon-calendar"></span>4 Jul 2023</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                                <div className="col-md-6 mt-2-6">
                                    <article className="blog-style1 position-relative d-block mb-0">
                                        <div className="img-holder position-relative d-block">
                                            <div className="image-hover">
                                                <img src={blog04} alt="..." />
                                            </div>
                                        </div>
                                        <div className="text-holder">
                                            <div className="category-box">
                                                <Link to="#!">Teacher</Link>
                                            </div>
                                            <h3 className="display-25 font-weight-700 mb-3"><Link to="blog-details.html">How eLearn Can Help You Improve Your Health.</Link></h3>
                                            <div><p>Duty obligations of business frequently occur pleasures enjoy...</p></div>
                                            <div className="bottom-box">
                                                <div className="btn-box">
                                                    <Link to="blog-details.html">
                                                        <span className="icon-right-arrow-1"></span>Read More
                                                    </Link>
                                                </div>
                                                <ul className="mb-0 ps-0">
                                                    <li><span className="icon-calendar"></span>30 Jun 2023</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                                <div className="col-md-6 mt-2-6">
                                    <article className="blog-style1 position-relative d-block mb-0">
                                        <div className="img-holder position-relative d-block">
                                            <div className="image-hover">
                                                <img src={blog05} alt="..." />
                                            </div>
                                        </div>
                                        <div className="text-holder">
                                            <div className="category-box">
                                                <Link to="#!">Awards</Link>
                                            </div>
                                            <h3 className="display-25 font-weight-700 mb-3"><Link to="blog-details.html">Why eLearn Had Been So Popular Till Now?</Link></h3>
                                            <div><p>Duty obligations of business frequently occur pleasures enjoy...</p></div>
                                            <div className="bottom-box">
                                                <div className="btn-box">
                                                    <Link to="blog-details.html">
                                                        <span className="icon-right-arrow-1"></span>Read More
                                                    </Link>
                                                </div>
                                                <ul className="mb-0 ps-0">
                                                    <li><span className="icon-calendar"></span>30 Jun 2023</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                                <div className="col-md-6 mt-2-6">
                                    <article className="blog-style1 position-relative d-block mb-0">
                                        <div className="img-holder position-relative d-block">
                                            <div className="image-hover">
                                                <img src={blog06} alt="..." />
                                            </div>
                                        </div>
                                        <div className="text-holder">
                                            <div className="category-box">
                                                <Link to="#!">Skill Development</Link>
                                            </div>
                                            <h3 className="display-25 font-weight-700 mb-3"><Link to="blog-details.html">Ten eLearn Tips You Need To Learn Now.</Link></h3>
                                            <div><p>Duty obligations of business frequently occur pleasures enjoy...</p></div>
                                            <div className="bottom-box">
                                                <div className="btn-box">
                                                    <Link to="blog-details.html">
                                                        <span className="icon-right-arrow-1"></span>Read More
                                                    </Link>
                                                </div>
                                                <ul className="mb-0 ps-0">
                                                    <li><span className="icon-calendar"></span>26 Jun 2023</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Blog;
