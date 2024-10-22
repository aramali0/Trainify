import React from 'react';
import EventItem from '../components/event/Eventitem';
import Header from '../components/Header';
import PageTitle from './PageTitle';
import Footer from '../components/Foooter';

const events = [
    {
        id: 1,
        image: "../assets/img/content/event-01.jpg",
        badge: "art competition",
        title: "Graphics design conference",
        description: "Attend the activities and analyze treasured recommendations from the pinnacle eLearn professionals.",
        date: "30 Mar. 2023",
        location: "London"
    },
    {
        id: 2,
        image: "../assets/img/content/event-02.jpg",
        badge: "Learning english",
        title: "Important learning english",
        description: "Attend the activities and analyze treasured recommendations from the pinnacle eLearn professionals.",
        date: "01 Apr. 2023",
        location: "London"
    },
    {
        id: 3,
        image: "../assets/img/content/event-03.jpg",
        badge: "creative day",
        title: "Annual creative meetup",
        description: "Attend the activities and analyze treasured recommendations from the pinnacle eLearn professionals.",
        date: "02 Apr. 2023",
        location: "London"
    },
    {
        id: 4,
        image: "../assets/img/content/event-04.jpg",
        badge: "art competition",
        title: "Digital arts and reshaping",
        description: "Attend the activities and analyze treasured recommendations from the pinnacle eLearn professionals.",
        date: "03 Apr. 2023",
        location: "London"
    }
];

const EventList = () => {
    return (
        <>
            <PageTitle />
            <section>
                <div className="container">
                    <div className="section-heading">
                        <span className="sub-title">latest events</span>
                        <h2 className="h1 mb-0">Our Upcoming Events</h2>
                    </div>
                    <div className="row g-xxl-5 mt-n2-9">
                        {events.map(event => (
                            <div className="col-xl-6 mt-2-9" key={event.id}>
                                <EventItem {...event} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default EventList;
