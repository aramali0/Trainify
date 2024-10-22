import React from 'react';
import { useTranslation } from 'react-i18next';

// Import images
import icon01 from '../assets/img/icons/icon-01.png';
import icon02 from '../assets/img/icons/icon-02.png';
import icon03 from '../assets/img/icons/icon-03.png';
import icon04 from '../assets/img/icons/icon-04.png';

const Counter = () => {
    const { t } = useTranslation(['home/counter']);

    const counters = [
        { icon: icon01, count: '78+', label: t('classesComplete') },
        { icon: icon02, count: '20k', label: t('totalStudents') },
        { icon: icon03, count: '400k', label: t('libraryBooks') },
        { icon: icon04, count: '1200+', label: t('certifiedTeachers') },
    ];

    return (
        <section className="pt-0">
            <div className="container">
                <div className="row mt-n1-9">
                    {counters.map((counter, index) => (
                        <div className="col-sm-6 col-lg-3 mt-1-9" key={index}>
                            <div className="counter-wrapper">
                                <div className="counter-icon">
                                    <div className="d-table-cell align-middle">
                                        <img src={counter.icon} className="w-55px" alt={counter.label} />
                                    </div>
                                </div>
                                <div className="counter-content">
                                    <h4 className="counter-number">
                                        <span className="countup">{counter.count}</span>
                                    </h4>
                                    <p className="mb-0 font-weight-600">{counter.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Counter;
