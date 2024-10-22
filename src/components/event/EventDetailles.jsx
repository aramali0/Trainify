import React from 'react';
import EventSpeakers from './EvenySpeakers';
import EventSchedule from './EventSchedule';
import EventLocation from './EventLocation';

const EventDetails = () => {
    return (
        <div className="col-md-12 col-lg-8 mb-2-9 mb-lg-0">
            <div className="row">
                <div className="col-md-12 mb-1-6 mb-md-1-9">
                    <div className="event-details-img position-relative">
                        <img className="border-radius-5" src="img/content/event-details-01.jpg" alt="Event Details" />
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="event-seprator">
                                <h2 className="text-primary">Student Exchange Program Sessions</h2>
                                <ul className="event-info-list mb-4 pb-4 borders-bottom border-color-medium-gray">
                                    <li><i className="ti-calendar pe-2 text-secondary"></i>22 August, 2023</li>
                                    <li><i className="ti-time pe-2 text-secondary"></i>10.00 AM - 06.00 PM</li>
                                    <li><i className="ti-location-pin pe-2 text-secondary"></i>27 Street, New York</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-12 mb-1-9">
                            <p className="alt-font font-weight-500 text-color">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                            </p>
                            <h3>Event Overview</h3>
                            <p className="alt-font font-weight-500 text-color">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                            </p>
                            <ul className="course-detail-list">
                                <li><i className="ti-check-box vertical-align-middle text-secondary pe-2"></i>Basic knowledge of digital marketing terms</li>
                                <li><i className="ti-check-box vertical-align-middle text-secondary pe-2"></i>Basic understanding of business</li>
                                <li><i className="ti-check-box vertical-align-middle text-secondary pe-2"></i>Pen and paper for taking notes</li>
                                <li><i className="ti-check-box vertical-align-middle text-secondary pe-2"></i>Internet connection</li>
                                <li><i className="ti-check-box vertical-align-middle text-secondary pe-2"></i>No digital marketing experience required!</li>
                            </ul>
                        </div>
                        <EventSpeakers />
                        <EventSchedule />
                        <EventLocation />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
