import React from 'react';

const EventItem = ({ image, badge, title, description, date, location }) => {
    return (
        <div className="row g-0 event-wrapper">
            <div className="col-md-5 event-img bg-img cover-background" style={{ backgroundImage: `url(${image})` }}>
            </div>
            <div className="col-md-7">
                <div className="p-1-6 p-sm-1-9">
                    <span className={`badge-soft ${badge === "Learning english" ? "secondary" : ""} mb-3`}>{badge}</span>
                    <h4 className="font-weight-800 h5 mb-3"><a href="event-details.html">{title}</a></h4>
                    <p className="mb-3 alt-font font-weight-500">{description}</p>
                    <div className="dotted-seprator pt-4 mt-4"></div>
                    <div className="d-flex justify-content-between align-items-center">
                        <p className="mb-0 text-primary font-weight-600"><i className="ti-calendar me-2"></i><span className="text-primary"> {date}</span></p>
                        <p className="mb-0 text-primary font-weight-600"><i className="ti-location-pin me-2"></i><span className="text-primary">{location}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventItem;
