import React from 'react';
import { Link } from 'react-router-dom';
import blogImg01 from '../assets/img/blog/blog-01.jpg';
import blogDetailImg02 from '../assets/img/blog/blog-detail-02.jpg';
import blogDetailImg03 from '../assets/img/blog/blog-detail-03.jpg';
import blogDetailImg01 from '../assets/img/blog/blog-detail-01.jpg';
import avatar15 from '../assets/img/avatar/avatar-15.jpg';
import avatar14 from '../assets/img/avatar/avatar-14.jpg';
import avatar09 from '../assets/img/avatar/avatar-09.jpg';
import avatar13 from '../assets/img/avatar/avatar-13.jpg';
import backgroundImage from '../assets/img/bg/bg-05.jpg';
import courseListInsta01 from '../assets/img/content/courses-01.jpg';
import courseListInsta02 from '../assets/img/content/courses-02.jpg';
import Header from '../components/Header';
import Footer from '../components/Foooter';
import '../assets/quform/css/base.css'

const BlogDetails = () => {
    return (
        <div className='main-wrapper'>
            <section className="page-title-section bg-img cover-background top-position1 left-overlay-dark" style={{ backgroundImage: `url(${backgroundImage})` }} data-overlay-dark="9">
                <div className="container">
                    <div className="row text-center">
                        <div className="col-md-12">
                            <h1>Blog Details</h1>
                        </div>
                        <div className="col-md-12">
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/blog-details">Blog Details</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOG DETAILS */}
            <section className="blogs">
                <div className="container">
                    <div className="row mt-n2-9">
                        {/* start blog left */}
                        <div className="col-md-12 col-lg-8 mt-2-9">
                            <div className="posts-wrapper">
                                {/* start post */}
                                <div className="blog-details-img">
                                    <img src={blogImg01} alt="Blog Image" />
                                </div>
                                <div className="post-content">
                                    <div className="post-meta blog-detail-seprator">
                                        <h2 className="font-weight-800 display-25 display-md-24 display-lg-23 display-xl-20 mb-3 text-capitalize">Skills that you can learn from eLearn.</h2>
                                        <ul className="meta-list">
                                            <li>
                                                <Link to="#" className="text-color"><i className="fa fa-user pe-1 text-secondary"></i> Admin</Link>
                                            </li>
                                            <li>
                                                <Link to="#" className="text-color"><i className="fa fa-calendar pe-1 text-secondary"></i> 6 Jul 2023</Link>
                                            </li>
                                            <li>
                                                <Link to="#" className="text-color"><i className="fa fa-comments pe-1 text-secondary"></i> 10 Comments</Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="row mb-1-6 mb-xl-1-9">
                                        <div className="col-md-12">
                                            <p className="alt-font font-weight-500 text-color">
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop.
                                            </p>
                                            <p className="alt-font font-weight-500 mb-0 text-color">
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Survived not only five centuries.
                                            </p>
                                            <blockquote>
                                                <p className="display-30 display-md-29 display-xl-28 alt-font font-weight-500 text-color">Equidem impedit officiis quo te. Illud partem sententiae mel eu, euripidis Urbanitas et sit. Mediocrem reprimique an vim, veniam tibique omit Tantur Duout, Agam Graeci.</p>
                                                <cite className="font-weight-800 text-primary">Writing By : Richard Muldoone</cite>
                                            </blockquote>
                                            <p className="alt-font font-weight-500 mb-0 text-color">
                                                Quuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quia non numquam eius modi tempora incidunt ut labore et dolore magnam dolor sit amet, consectetur adipisicing.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="row mb-1-6 mb-xl-1-9">
                                        <div className="col-lg-6 mb-1-6 mb-md-1-9 mb-lg-0">
                                            <img className="border-radius-5" src={blogDetailImg02} alt="..." />
                                        </div>
                                        <div className="col-lg-6">
                                            <img className="border-radius-5" src={blogDetailImg03} alt="..." />
                                        </div>
                                    </div>

                                    <div className="row mb-1-6 mb-xl-1-9">
                                        <div className="col-md-12">
                                            <h4 className="display-27 display-md-25 display-lg-24 display-xl-21 font-weight-800 mb-3 text-capitalize">Learn From Our Extensive Subscription</h4>
                                            <p className="alt-font mb-0 font-weight-500 text-color">
                                                consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. excepteur sint occaecat cupidatat non proident minim veniam.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row mb-1-6 mb-xl-1-9">
                                        <div className="col-lg-12 col-xl-6 mb-1-6 mb-md-1-9 mb-xl-0">
                                            <img className="border-radius-5" src={blogDetailImg01} alt="..." />
                                        </div>
                                        <div className="col-lg-12 col-xl-6">
                                            <h4 className="display-28 display-lg-26 display-xl-25 font-weight-800 mb-3">Beneficial Study Strategies</h4>
                                            <p className="alt-font mb-3 font-weight-500 text-color">
                                                Proin viverra nisi at nisl imperdiet auctnec ornare, estsed tincidunare tincidunt. t risutincidat, senibeget at varius enim sem at sem. Fuce tempus ex nibh esed tincidunt placat.Nunc facilisis erat at ligula blandit tempor.
                                            </p>
                                            <ul className="blog-detail-list">
                                                <li><i className="ti-check-box vertical-align-middle text-secondary pe-2"></i>Skills For getting a better result.</li>
                                                <li><i className="ti-check-box vertical-align-middle text-secondary pe-2"></i>Communication Skills to getting.</li>
                                                <li><i className="ti-check-box vertical-align-middle text-secondary pe-2"></i>A Career Overview opportunity.</li>
                                                <li><i className="ti-check-box vertical-align-middle text-secondary pe-2"></i>A good Works Environment.</li>
                                                <li><i className="ti-check-box vertical-align-middle text-secondary pe-2"></i>No digital marketing experience.</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="mb-0 alt-font font-weight-500 text-color">
                                            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                                        </p>
                                    </div>
                                    <div className="separator"></div>
                                    <div className="row no-gutters">
                                        <div className="col-md-6 col-xs-12 mb-1-6 mb-md-0">
                                            <div className="tags">
                                                <h5 className="display-28 display-lg-26 display-xl-25 font-weight-800 mb-3">Related Tags</h5>
                                                <ul className="blog-post-tag">
                                                    <li><Link to="#!">Education</Link></li>
                                                    <li><Link to="#!">Tips</Link></li>
                                                    <li><Link to="#!">Courses</Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-xs-12">
                                            <h5 className="display-28 display-lg-26 display-xl-25 font-weight-800 mb-3">Share Post</h5>
                                            <ul className="social-icons">
                                                <li><Link to="#!" className="sc_facebook"><i className="fab fa-facebook-f"></i></Link></li>
                                                <li><Link to="#!" className="sc_twitter"><i className="fab fa-twitter"></i></Link></li>
                                                <li><Link to="#!" className="sc_dribbble"><i className="fab fa-dribbble"></i></Link></li>
                                                <li><Link to="#!" className="sc_pinterest"><i className="fab fa-pinterest"></i></Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                {/* end post */}
                            </div>
                        </div>
                        {/* end blog left */}

                        {/* start blog right */}
                        <div className="col-md-12 col-lg-4 mt-2-9">
                            <aside className="side-bar">
                                {/* start widget */}
                                <div className="widget">
                                    <form className="search-form" action="search.html" method="get">
                                        <input type="text" className="search-input" name="search" placeholder="Search Here..." />
                                        <button className="search-button" type="submit"><i className="fas fa-search"></i></button>
                                    </form>
                                </div>
                                {/* end widget */}

                                {/* start widget */}
                                <div className="widget">
                                    <h4 className="display-28 display-md-26 display-lg-25 font-weight-800 mb-3">About Author</h4>
                                    <div className="author">
                                        <div className="author-img">
                                            <img src={avatar15} alt="Author" />
                                        </div>
                                        <h5>Richard Muldoone</h5>
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
                                    </div>
                                </div>
                                {/* end widget */}

                                {/* start widget */}
                                <div className="widget">
                                    <h4 className="display-28 display-md-26 display-lg-25 font-weight-800 mb-3">Popular Posts</h4>
                                    <div className="popular-post">
                                        <div className="popular-post-img">
                                            <img src={avatar14} alt="..." />
                                        </div>
                                        <div className="popular-post-content">
                                            <h5><Link to="#!">Lorem Ipsum Dolor Sit Amet</Link></h5>
                                            <span>6 Jul 2023</span>
                                        </div>
                                    </div>
                                    <div className="popular-post">
                                        <div className="popular-post-img">
                                            <img src={avatar09} alt="..." />
                                        </div>
                                        <div className="popular-post-content">
                                            <h5><Link to="#!">Lorem Ipsum Dolor Sit Amet</Link></h5>
                                            <span>6 Jul 2023</span>
                                        </div>
                                    </div>
                                    <div className="popular-post">
                                        <div className="popular-post-img">
                                            <img src={avatar13} alt="..." />
                                        </div>
                                        <div className="popular-post-content">
                                            <h5><Link to="#!">Lorem Ipsum Dolor Sit Amet</Link></h5>
                                            <span>6 Jul 2023</span>
                                        </div>
                                    </div>
                                </div>
                                {/* end widget */}

                                {/* start widget */}
                                <div className="widget">
                                    <h4 className="display-28 display-md-26 display-lg-25 font-weight-800 mb-3">Follow Us</h4>
                                    <ul className="social-icons">
                                        <li><Link to="#!" className="sc_facebook"><i className="fab fa-facebook-f"></i></Link></li>
                                        <li><Link to="#!" className="sc_twitter"><i className="fab fa-twitter"></i></Link></li>
                                        <li><Link to="#!" className="sc_dribbble"><i className="fab fa-dribbble"></i></Link></li>
                                        <li><Link to="#!" className="sc_pinterest"><i className="fab fa-pinterest"></i></Link></li>
                                    </ul>
                                </div>
                                {/* end widget */}

                                {/* start widget */}
                                <div className="widget">
                                    <h4 className="display-28 display-md-26 display-lg-25 font-weight-800 mb-3">Instagram</h4>
                                    <ul className="instagram-feed">
                                        <li><Link to="#!"><img src={courseListInsta01} alt="..." /></Link></li>
                                        <li><Link to="#!"><img src={courseListInsta02} alt="..." /></Link></li>
                                    </ul>
                                </div>
                                {/* end widget */}
                            </aside>
                        </div>
                        {/* end blog right */}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BlogDetails;
