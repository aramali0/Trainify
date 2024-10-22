import React from 'react';
import { FaPlay } from 'react-icons/fa'; // For the play button icon
import { TfiBookmark, TfiPackage, TfiPanel } from 'react-icons/tfi';
import { useTranslation } from 'react-i18next';

// Import image
import whyChooseImg from '../assets/images/home/facility.jpg';

const WhyChooseUs = () => {
    const { t } = useTranslation(['home/whyChooseUs']);

    const features = [
        {
            icon: <TfiPanel className="display-15 text-secondary" />,
            title: t('innovativeLearning.title'),
            description: t('innovativeLearning.description')
        },
        {
            icon: <TfiPackage className="display-15 text-secondary" />,
            title: t('accreditation.title'),
            description: t('accreditation.description')
        },
        {
            icon: <TfiBookmark className="display-15 text-secondary" />,
            title: t('seamlessIntegration.title'),
            description: t('seamlessIntegration.description')
        }
    ];

    return (
        <section>
            <div className="container">
                <div className="row align-items-center mt-n1-9">
                    {/* Left Column - Image */}
                    <div className="col-lg-6 mt-1-9">
                        <div className="why-choose-img position-relative">
                            <img
                                className="border-radius-5 shadow-lg"
                                src={whyChooseImg}
                                alt={t('altImage')}
                                style={{
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '450px',
                                    borderRadius: '10px',
                                }}
                            />
                            {/* Play Button */}
                            <div className="position-absolute top-50 start-50 translate-middle story-video">
                                <a className="video video_btn md relative" href="https://www.youtube.com/watch?v=ZPs3URGs0KQ" style={{ color: '#fff' }}>
                                    <FaPlay className="font-size22 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Content */}
                    <div className="col-lg-6 mt-1-9">
                        <div className="why-choose-content">
                            {/* Heading */}
                            <div className="mb-1-9">
                                <h2 className="h1 mb-2 text-primary">{t('whyChooseUsHeading')}</h2>
                                <p className="mb-0">
                                    {t('whyChooseUsDescription')}
                                </p>
                            </div>

                            {/* Features */}
                            {features.map((feature, index) => (
                                <React.Fragment key={index}>
                                    <div className="media mb-4">
                                        {feature.icon}
                                        <div className="media-body ps-3">
                                            <h4 className="h5 font-weight-700 mb-2">{feature.title}</h4>
                                            <p className="mb-0 w-lg-90">{feature.description}</p>
                                        </div>
                                    </div>

                                    {index < features.length - 1 && <div className="dotted-separator pt-1-9 mt-1-9"></div>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
