// src/components/InstructorsSection.js
import React from 'react';
import team1 from '../assets/img/team/team-01.jpg';
import team2 from '../assets/img/team/team-02.jpg';
import team3 from '../assets/img/team/team-03.jpg';
import team4 from '../assets/img/team/team-04.jpg';
import team5 from '../assets/img/team/team-05.jpg';
import team6 from '../assets/img/team/team-06.jpg';
import Header from '../components/Header';
import Footer from '../components/Foooter';
import PageTitle from './PageTitle';
import InstructorCard from '../components/instruction/InstructorCard';

const instructors = [
    {
        image: team1,
        name: 'Murilo Souza',
        title: 'Web Designer',
        description: 'I preserve each companion certification and I\'m an authorized AWS solutions architect professional.'
    },
    {
        image: team2,
        name: 'Balsam Samira',
        title: 'Photographer',
        description: 'I preserve each companion certification and I\'m an authorized AWS solutions architect professional.'
    },
    {
        image: team3,
        name: 'Rodrigo Ribeiro',
        title: 'Psychologist',
        description: 'I preserve each companion certification and I\'m an authorized AWS solutions architect professional.'
    },
    {
        image: team4,
        name: 'Melissa Padgett',
        title: 'Paraeducator',
        description: 'I preserve each companion certification and I\'m an authorized AWS solutions architect professional.'
    },
    {
        image: team5,
        name: 'Austin Smith',
        title: 'Teaching Fellow',
        description: 'I preserve each companion certification and I\'m an authorized AWS solutions architect professional.'
    },
    {
        image: team6,
        name: 'Leigh Minarik',
        title: 'Ballistics Professor',
        description: 'I preserve each companion certification and I\'m an authorized AWS solutions architect professional.'
    }
];

const InstructorsSection = () => (
    <div>
        <PageTitle />
        <section>
            <div className="container">
                <div className="section-heading">
                    <span className="sub-title">Instructors</span>
                    <h2 className="h1 mb-0">Experience Instructors</h2>
                </div>
                <div className="row">
                    {instructors.map((instructor, index) => (
                        <InstructorCard
                            key={index}
                            image={instructor.image}
                            name={instructor.name}
                            title={instructor.title}
                            description={instructor.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    </div>
);

export default InstructorsSection;
