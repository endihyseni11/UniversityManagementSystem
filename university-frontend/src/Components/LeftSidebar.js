import React, { useState, useEffect } from 'react';
import '../CssDesigns/LeftSidebar.css';

const LeftSidebar = ({ token, userId, userRole }) => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    // Define a function to fetch the user details
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('https://localhost:7069/api/Auth/getUserDetails', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    
        const data = await response.json();
        console.log('User Details Data:', data);
    
        setUserDetails(data);
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      }
    };
    
    // Call the function to fetch the user details
    fetchUserDetails();
  }, [token]);  // Include token as a dependency to re-run the effect when it changes

  useEffect(() => {
    // Log the updated state when userDetails changes
    console.log('Updated UserDetails State:', userDetails);
    console.log('userRoleLeft', userRole)
  }, [userDetails, userRole]);

  return (
    <div className="left-sidebar">
      <h4 style={{ marginTop: '10%', marginLeft:'20%'}}>My Data</h4>
      {userDetails && (
        <div className='infoSideBar'>
          <p ><strong>Username:</strong> {userDetails?.username}</p>
          <p><strong>Name:</strong> {userDetails?.name}</p>
          <p><strong>Surname:</strong> {userDetails?.surname}</p>
          <p><strong>User Type:</strong> {userDetails?.userType}</p>
          {userDetails?.userType === 'Student' && (
          <div>
            <p><strong>ID: </strong> {userDetails?.additionalAttributes?.student_id}</p>
            <p><strong>Date of Birth: </strong>{userDetails?.additionalAttributes?.date_of_birth}</p>
            <p><strong>Gender: </strong>{userDetails?.additionalAttributes?.gender}</p>
            <p><strong>Email: </strong>{userDetails?.additionalAttributes?.email}</p>
            <p><strong>Phone Number: </strong>{userDetails?.additionalAttributes?.phone_number}</p>
            <p><strong>Address: </strong>{userDetails?.additionalAttributes?.address}</p>
            <p><strong>Department ID: </strong>{userDetails?.additionalAttributes?.department_id}</p>
            {/* Add other student-specific properties as needed */}
          </div>          
          )}

          {userDetails?.userType === 'Teacher' && (
          <div>
            <p><strong>ID:</strong> {userDetails?.additionalAttributes?.teacher_id}</p>
            <p><strong>Department ID:</strong> {userDetails?.additionalAttributes?.department_id}</p>
            <p><strong>Academic Rank:</strong> {userDetails?.additionalAttributes?.academic_rank}</p>
            <p><strong>Office Location:</strong> {userDetails?.additionalAttributes?.office_location}</p>
            <p><strong>Office Hours:</strong> {userDetails?.additionalAttributes?.office_hours}</p>
            <p><strong>Research Interests:</strong> {userDetails?.additionalAttributes?.research_interests}</p>
          </div>
          
          )}

          {userDetails?.userType === 'Management' && (
          <div>
            <p><strong>ID:</strong> {userDetails?.additionalAttributes?.management_id}</p>
            <p><strong>Position:</strong> {userDetails?.additionalAttributes?.position}</p>
            <p><strong>University ID:</strong> {userDetails?.additionalAttributes?.university_id}</p>
          </div>
          
          )}

        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
