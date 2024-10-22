import React from 'react';

const EventSchedule = () => {
    return (
        <div className="col-md-12 mb-1-9">
            <h3>Event Schedule</h3>
            <p className="alt-font font-weight-500 text-color mb-1-6">
                Even slightly believable. If you are going use a passage of Lorem Ipsum need equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish.
            </p>
            <div className="event-schedule-table table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="time">Time</th>
                            <th className="topics">Topics</th>
                            <th className="speakers">Speakers</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="time">10.00 am to 10.30 am</td>
                            <td className="topics">Registration and T-shirt distribution</td>
                            <td className="speakers">-----------</td>
                        </tr>
                        <tr>
                            <td className="time">10.35 am to 11.00 am</td>
                            <td className="topics">Latest version of WordPress and it's Benefit</td>
                            <td className="speakers">Alister Camble</td>
                        </tr>
                        <tr>
                            <td className="time">11.05 am to 11.30 am</td>
                            <td className="topics">Snacks &amp; Tea Break</td>
                            <td className="speakers">-----------</td>
                        </tr>
                        <tr>
                            <td className="time">11.35 am to 12.35 pm</td>
                            <td className="topics">How to use latest version of WordPress</td>
                            <td className="speakers">Ethan Smith</td>
                        </tr>
                        <tr>
                            <td className="time">12.40 pm to 1.45 pm</td>
                            <td className="topics">Future of WordPress</td>
                            <td className="speakers">Keth Williams</td>
                        </tr>
                        <tr>
                            <td className="time">1.50 pm to 2.15 pm</td>
                            <td className="topics">Thanks giving &amp; closing</td>
                            <td className="speakers">Organizer</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EventSchedule;
