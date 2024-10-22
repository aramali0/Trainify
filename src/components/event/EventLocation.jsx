import React from 'react';

const EventLocation = () => {
    return (
        <div className="col-md-12 event-seprator">
            <h3>Event Location</h3>
            <p className="alt-font font-weight-500 text-color mb-1-6">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
            </p>
            <ul className="event-meta mb-4 ps-0">
                <li><i className="ti-location-pin"></i>New York City, USA</li>
                <li><i className="ti-mobile"></i>+012 (345) 6789</li>
            </ul>
            <iframe width="100%" height="400" src="https://maps.google.com/maps?q=london&t=&z=13&ie=UTF8&iwloc=&output=embed" title="Event Location" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
        </div>
    );
};

export default EventLocation;
