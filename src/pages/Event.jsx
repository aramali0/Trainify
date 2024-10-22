import React from 'react';
import EventDetails from '../components/event/EventDetailles';
import Sidebar from '../components/event/SideBare';
import Header from '../components/Header';
import Footer from '../components/Foooter';

const Event = () => {
    return (
        <>
            <section className="courses">
                <div className="container">
                    <div className="row">
                        <EventDetails />
                        <div className="col-md-12 col-lg-4">
                            <Sidebar />
                        </div>
                    </div>
                </div>
            </section>
        </>

    );
};

export default Event;
