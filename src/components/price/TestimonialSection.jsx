// src/components/TestimonialSection.js
import React from 'react';
import testimonialAvatar1 from '../../assets/img/avatar/avatar-01.jpg';
import testimonialAvatar2 from '../../assets/img/avatar/avatar-02.jpg';
import testimonialAvatar3 from '../../assets/img/avatar/avatar-03.jpg';
import testimonialAvatar4 from '../../assets/img/avatar/avatar-04.jpg';
import testimonialAvatar5 from '../../assets/img/avatar/avatar-05.jpg';
import testimonialAvatar6 from '../../assets/img/avatar/avatar-06.jpg';
import testimonialBackground from '../../assets/img/bg/bg-03.jpg';

const testimonials = [
    {
        text: "Loan was worth a fortune to my company. I didn't even need training. I am really satisfied with my loan. Loan has got everything I need. We've used loan for the last five years.",
        author: 'Callum Lissa',
        position: 'Founder',
    },
    {
        text: "Loan is the next killer app. We can't understand how we've been living without loan. It's exactly what I've been looking for. Wow what great service, I love it! Buy this now. Loan is both attractive and highly adaptable.",
        author: 'Bethany Nichols',
        position: 'General Manager',
    },
    {
        text: "Thank you so much for your help. Loan saved my business. Without loan, we would have gone bankrupt by now. Loan is worth much more than I paid. I can't say enough about loan. The very best. I have gotten at least 50 times the value from loan.",
        author: 'Lily Hogben',
        position: 'CEO',
    },
];

const TestimonialSection = () => (
    <section className="bg-light">
        <div className="container">
            <div className="section-heading">
                <span className="sub-title">Testimonial</span>
                <h2 className="h1 mb-0">What Educators Say About Us!</h2>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-8 position-relative">
                    <div className="testimonial-carousel text-center owl-carousel owl-theme">
                        {testimonials.map((testimonial, index) => (
                            <div key={index}>
                                <p className="mb-1-9 mb-lg-6 lead">{testimonial.text}</p>
                                <h6 className="mb-0 h5">
                                    {testimonial.author} <small className="text-primary">- {testimonial.position}</small>
                                </h6>
                            </div>
                        ))}
                    </div>
                    <h6 className="testimonial-quote">“</h6>
                </div>
            </div>
        </div>
        <div>
            <img src={testimonialAvatar1} className="position-absolute bottom-15 left-20 d-none d-lg-block rounded-circle w-40px" alt="..." />
            <img src={testimonialAvatar2} className="position-absolute bottom-40 left-10 d-none d-lg-block rounded-circle" alt="..." />
            <img src={testimonialAvatar3} className="position-absolute left-20 top-20 d-none d-lg-block rounded-circle w-60px" alt="..." />
            <img src={testimonialAvatar4} className="position-absolute top-45 right-10 d-none d-lg-block rounded-circle" alt="..." />
            <img src={testimonialAvatar5} className="position-absolute top-25 right-20 d-none d-lg-block rounded-circle w-40px" alt="..." />
            <img src={testimonialAvatar6} className="position-absolute bottom-15 right-15 d-none d-lg-block rounded-circle" alt="..." />
        </div>
        <div className="shape21">
            <img src={testimonialBackground} alt="..." />
        </div>
        <span className="process-left-shape d-none d-sm-block"></span>
    </section>
);

export default TestimonialSection;
