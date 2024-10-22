import React, { useState } from 'react';

const FAQForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        phone: '',
        message: '',
        captcha: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form data submitted:', formData);
    };

    return (
        <section className="bg-very-light-gray py-md-8 pb-lg-0">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="faq-image">
                            <img src="img/content/faq-bg.jpg" alt="FAQ Background" />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="faq-form">
                            <h2 className="mb-4 text-primary">Ask Us Anything</h2>
                            <form className="contact quform" onSubmit={handleSubmit}>
                                <div className="quform-elements">
                                    <div className="row">

                                        {/* Text input elements */}
                                        {['name', 'email', 'subject', 'phone'].map((field, index) => (
                                            <div className="col-md-6" key={index}>
                                                <div className="quform-element form-group">
                                                    <label htmlFor={field}>
                                                        {`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                                                        {field !== 'phone' && <span className="quform-required">*</span>}
                                                    </label>
                                                    <div className="quform-input">
                                                        <input
                                                            className="form-control"
                                                            id={field}
                                                            type="text"
                                                            name={field}
                                                            value={formData[field]}
                                                            onChange={handleChange}
                                                            placeholder={`Your ${field} here`}
                                                            required={field !== 'phone'}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Textarea element */}
                                        <div className="col-md-12">
                                            <div className="quform-element form-group">
                                                <label htmlFor="message">Message <span className="quform-required">*</span></label>
                                                <div className="quform-input">
                                                    <textarea
                                                        className="form-control"
                                                        id="message"
                                                        name="message"
                                                        rows="3"
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        placeholder="Tell us a few words"
                                                        required
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Captcha element */}
                                        <div className="col-md-12">
                                            <div className="quform-element">
                                                <div className="form-group">
                                                    <div className="quform-input">
                                                        <input
                                                            className="form-control"
                                                            id="captcha"
                                                            type="text"
                                                            name="captcha"
                                                            value={formData.captcha}
                                                            onChange={handleChange}
                                                            placeholder="Type the below word"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="quform-captcha">
                                                        <div className="quform-captcha-inner">
                                                            <img src="quform/images/captcha/courier-new-light.png" alt="Captcha" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submit button */}
                                        <div className="col-md-12">
                                            <div className="quform-submit-inner">
                                                <button className="butn secondary" type="submit">
                                                    <i className="far fa-paper-plane icon-arrow before"></i>
                                                    <span className="label">Send Message</span>
                                                    <i className="far fa-paper-plane icon-arrow after"></i>
                                                </button>
                                            </div>
                                            <div className="quform-loading-wrap text-start">
                                                <span className="quform-loading"></span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQForm;
