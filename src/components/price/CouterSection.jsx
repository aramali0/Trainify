// src/components/CounterSection.js
import React from 'react';
import counterIcon1 from '../../assets/img/icons/icon-01.png';
import counterIcon2 from '../../assets/img/icons/icon-02.png';
import counterIcon3 from '../../assets/img/icons/icon-03.png';
import counterIcon4 from '../../assets/img/icons/icon-04.png';

const counters = [
    { icon: counterIcon1, number: '78+', label: 'Classes Complete' },
    { icon: counterIcon2, number: '20k', label: 'Total Students' },
    { icon: counterIcon3, number: '400k', label: 'Library Books' },
    { icon: counterIcon4, number: '1200+', label: 'Certified Teachers' },
];

const CounterSection = () => (
    <section className="pt-0">
        <div className="container">
            <div className="row mt-n1-9">
                {counters.map((counter, index) => (
                    <div key={index} className="col-sm-6 col-lg-3 mt-1-9">
                        <div className="counter-wrapper">
                            <div className="counter-icon">
                                <div className="d-table-cell align-middle">
                                    <img src={counter.icon} className="w-55px" alt="Counter Icon" />
                                </div>
                            </div>
                            <div className="counter-content">
                                <h4 className="counter-number">
                                    <span className="countup">{counter.number}</span>
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

export default CounterSection;
