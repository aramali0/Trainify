import React from 'react';

// Import images
import blog1 from '../assets/img/blog/blog-01.jpg';
import blog7 from '../assets/img/blog/blog-07.jpg';

const Blog = () => {
    return (
        <section className="position-relative">
            <div className="container">
                <div className="section-heading">
                    <span className="sub-title">our news</span>
                    <h2 className="h1 mb-0">Our Latest Blog</h2>
                </div>
                <div className="row g-5">
                    <div className="col-lg-6 col-xl-4">
                        <article className="blog-style1 position-relative d-block mb-0">
                            <div className="img-holder position-relative d-block">
                                <div className="image-hover">
                                    <img src={blog1} alt="Blog 1" />
                                </div>
                            </div>
                            <div className="text-holder">
                                <div className="category-box">
                                    <a href="#!">creative</a>
                                </div>
                                <h3 className="display-25 font-weight-700 mb-3">
                                    <a href="blog-details.html">Skills that you can learn from eLearn.</a>
                                </h3>
                                <div>
                                    <p>Duty obligations of business frequently occur pleasures enjoy...</p>
                                </div>
                                <div className="bottom-box">
                                    <div className="btn-box">
                                        <a href="blog-details.html">
                                            <span className="icon-right-arrow-1"></span>Read More
                                        </a>
                                    </div>
                                    <ul className="mb-0 ps-0">
                                        <li><span className="icon-calendar"></span>6 Jul 2023</li>
                                    </ul>
                                </div>
                            </div>
                        </article>
                    </div>

                    <div className="col-lg-6 col-xl-4 d-none d-lg-block">
                        <div>
                            <div className="image-hover">
                                <img src={blog7} alt="Blog 7" />
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-4">
                        <div className="blog-style1 blog-two-style1 mb-1-9 h-auto">
                            <div className="text-holder">
                                <div className="category-box">
                                    <a href="#!">Learning</a>
                                </div>
                                <h3 className="display-25 font-weight-700 mb-3">
                                    <a href="blog-details.html">Is eLearn any good? 7 ways you can be certain.</a>
                                </h3>
                                <div className="bottom-box">
                                    <div className="btn-box">
                                        <a href="blog-details.html">
                                            <span className="icon-right-arrow-1"></span>Read More
                                        </a>
                                    </div>
                                    <div className="meta-info">
                                        <ul className="mb-0 ps-0">
                                            <li><span className="icon-calendar"></span>4 Jul 2023</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="blog-style1 blog-two-style1 h-auto">
                            <div className="text-holder">
                                <div className="category-box">
                                    <a href="#!">Career</a>
                                </div>
                                <h3 className="display-25 font-weight-700 mb-3">
                                    <a href="blog-details.html">How will eLearn be in the future.</a>
                                </h3>
                                <div className="bottom-box">
                                    <div className="btn-box">
                                        <a href="blog-details.html">
                                            <span className="icon-right-arrow-1"></span>Read More
                                        </a>
                                    </div>
                                    <div className="meta-info">
                                        <ul className="mb-0 ps-0">
                                            <li><span className="icon-calendar"></span>2 Jul 2023</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Blog;
