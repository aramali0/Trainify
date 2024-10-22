import React from 'react'
import Header from '../components/Header'
import PageTitle from './PageTitle'
import Footer from '../components/Foooter'
import Instructor from '../components/instruction/Instructor'

function InstructorDetails() {
  return (
    <div className='main-wrapper'>
      <PageTitle />
      <Instructor />
    </div>
  )
}

export default InstructorDetails