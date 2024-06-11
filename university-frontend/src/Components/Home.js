import React from 'react';
import { useHistory } from 'react-router-dom';
import University from './University';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import '../CssDesigns/Home.css';

const Home = ({ userRole, userId }) => {
  const history = useHistory();

  const navigateToPage = (page) => {
    history.push(`/${page.toLowerCase()}`);
  };

  console.log('userRole:', userRole); // Log userRole
  console.log('userId:', userId); // Log userRole
  const renderBox = (label) => {
    // Conditionally render boxes based on the user's role
    switch (userRole) {
      case 'Management':
        return <div className="box" onClick={() => navigateToPage(label)}>{label}</div>;
      case 'Teacher':
        if (label === 'Course' || label === 'Schedule' || label === 'Room' || label === 'Enrollment' || label === 'Student') {
          return <div className="box" onClick={() => navigateToPage(label)}>{label}</div>;
        }
        return null;
      case 'Student':
        if (label === 'Enrollment' || label === 'Schedule' || label === 'Room' || label === 'Course') {
          return <div className="box" onClick={() => navigateToPage(label)}>{label}</div>;
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className='homeDiv'>
      <div className="box-container">
        {renderBox('Users')}
        {renderBox('University')}
        {renderBox('Department')}
        {renderBox('Teacher')}
        {renderBox('Student')}
        {renderBox('Management')}
        {renderBox('Course')}
        {renderBox('Schedule')}
        {renderBox('Room')}
        {renderBox('Enrollment')}
        {renderBox('Role')}
      </div>
      <Switch>
        <Route path="/university" component={University} />
      </Switch>
    </div>
  );
};

export default Home;
