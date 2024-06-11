import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Home from './Components/Home';
import Header from './Components/Header';
import University from './Components/University';
import LeftSidebar from './Components/LeftSidebar';
import Department from './Components/Department';
import UserProfile from './Components/UserProfile';
import Users from './Components/Users';
import Dashboard from './Components/Dashboard';
import Management from './Components/Management';
import Student from './Components/Student';
import Teacher from './Components/Teacher';
import Course from './Components/Course';
import Room from './Components/Room';
import Schedule from './Components/Schedule';
import Role from './Components/Role';
import Enrollment from './Components/Enrollment';


const PrivateRoute = ({ component: Component, isLoggedIn, userId, token, studentId, ...rest }) => (
  
<Route
    {...rest}
    render={props => isLoggedIn ? <Component userId={userId} token={token} studentId={studentId} {...props} /> : <Redirect to="/" />}
  />
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [isNotificationVisible, setNotificationVisible] = useState(false); // Add this state variable
  const [studentId, setStudentId] = useState('');

  const handleLogin = (role, token, userId, studentId) => {
    console.log('Received userId in handleLogin:', userId); // Log the received userId
    setIsLoggedIn(true);
    setUserRole(role);
    setToken(token);
    setUserId(userId);
    setStudentId(studentId);
    setUsername('');
  
    const userData = { isLoggedIn: true, userRole: role, token, userId ,studentId };
    sessionStorage.setItem('userData', JSON.stringify(userData));
    console.log("student_id:", studentId)
    console.log('Session Storage Updated:', sessionStorage.getItem('userData'));
  };
  
  

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setUserId('');
    sessionStorage.removeItem('userData');
  };
  const handleCloseNotification = () => {
    setNotificationVisible(false);
  };
  useEffect(() => {
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      const { isLoggedIn, userRole, token, userId } = JSON.parse(storedUserData);
      setIsLoggedIn(isLoggedIn);
      setUserRole(userRole);
      setToken(token);
      setUserId(userId);
    }
  }, []); // The empty dependency array ensures that this effect runs only once on mount
  
  useEffect(() => {
    console.log('userRole in Home:', userRole);
  }, [userRole]);
  
  return (
    <div className="App">
      <Router>
        {isLoggedIn && <Header token={token} userId={userId} handleLogout={handleLogout} userRole={userRole} />}
        <div className="app-content">
        {isLoggedIn && <LeftSidebar token={token} userId={userId} userRole={userRole}/>}
          <div className="main-content">
            <Switch>
              <Route exact path="/">
                {isLoggedIn ? <Redirect to="/home" /> : <Login handleLogin={handleLogin} />}
              </Route>
              <PrivateRoute
                path="/home"
                component={(props) => <Home {...props} userRole={userRole} />}
                isLoggedIn={isLoggedIn}
                userId={userId}
                token={token}
                userRole={userRole}
                studentId={studentId}
              />

              <PrivateRoute
                path="/university"
                component={(props) => <University {...props} userRole={userRole} />}
                isLoggedIn={isLoggedIn}
                userId={userId}
                token={token}
                userRole={userRole}
              />
              <PrivateRoute
                path="/enrollment"
                component={(props) => <Enrollment {...props} userRole={userRole} />}
                isLoggedIn={isLoggedIn}
                userId={userId}
                token={token}
                userRole={userRole}
              />
              <PrivateRoute
                path="/course"
                component={(props) => <Course {...props} userRole={userRole} />}
                isLoggedIn={isLoggedIn}
                userId={userId}
                token={token}
                userRole={userRole}
                studentId={studentId}
              />
              <PrivateRoute
                path="/role"
                component={(props) => <Role {...props} userRole={userRole} />}
                isLoggedIn={isLoggedIn}
                userId={userId}
                token={token}
                userRole={userRole}
              />
              <PrivateRoute
                path="/schedule"
                component={(props) => <Schedule {...props} userRole={userRole} />}
                isLoggedIn={isLoggedIn}
                userId={userId}
                token={token}
                userRole={userRole}
                studentId={studentId}
              />
              <PrivateRoute
                path="/room"
                component={(props) => <Room {...props} userRole={userRole} />}
                isLoggedIn={isLoggedIn}
                userId={userId}
                token={token}
                userRole={userRole}
              />
              <PrivateRoute
                path="/student"
                component={(props) => <Student {...props} userRole={userRole} />}
                isLoggedIn={isLoggedIn}
                userId={userId}
                token={token}
                userRole={userRole}
              />
              <PrivateRoute
                path="/department"
                component={(props) => <Department {...props} userRole={userRole} />}
                isLoggedIn={isLoggedIn}
                userId={userId}
                token={token}
                userRole={userRole}
              />
              <PrivateRoute
                path="/management"
                component={(props) => <Management {...props} userRole={userRole} />}
                isLoggedIn={isLoggedIn}
                userId={userId}
                token={token}
                userRole={userRole}
              />
              <PrivateRoute
                path="/users"
                component={(props) => <Users {...props} userRole={userRole} />}
                isLoggedIn={isLoggedIn}
                userId={userId}
                token={token}
                userRole={userRole}
              />
              <PrivateRoute
                path="/teacher"
                component={(props) => <Teacher {...props} userRole={userRole} />}
                isLoggedIn={isLoggedIn}
                userId={userId}
                token={token}
                userRole={userRole}
              />
              <PrivateRoute
                path="/user"
                component={(props) => <UserProfile {...props} userRole={userRole} />}
                isLoggedIn={isLoggedIn}
                userId={userId}
                token={token}
                userRole={userRole}
              />
              <PrivateRoute
                path="/dashboard"
                component={(props) => <Dashboard {...props} userRole={userRole} />}
                isLoggedIn={isLoggedIn}
                userId={userId}
                token={token}
                userRole={userRole}
              />

              {/* Add more routes as needed */}
            </Switch>
          </div>
        </div>
      </Router>
    </div>
  );
  
};

export default App;
