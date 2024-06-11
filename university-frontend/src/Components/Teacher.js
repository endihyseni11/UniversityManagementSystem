import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Form } from 'react-bootstrap';

const Teacher = () => {
  const [teacherList, setTeacherList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [teacherID, setTeacherID] = useState('');
  const [departmentID, setDepartmentID] = useState('');
  const [userID, setUserID] = useState('');
  const [officeLocation, setOfficeLocation] = useState('');
  const [officeHours, setOfficeHours] = useState('');
  const [academicRank, setAcademicRank] = useState('');
  const [researchInterests, setResearchInterests] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalAction, setModalAction] = useState('');
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState('');
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    fetchTeacherData();
    fetchDepartmentData();
    fetchUserData();
  }, [setForceUpdate]);

  const fetchTeacherData = () => {
    fetch('https://localhost:7069/api/Teachers')
      .then((response) => response.json())
      .then((data) => setTeacherList(data))
      .catch((error) => console.log(error));
  };

  const fetchDepartmentData = () => {
    fetch('https://localhost:7069/api/Department')
      .then((response) => response.json())
      .then((data) => setDepartmentList(data))
      .catch((error) => console.log(error));
  };

  const fetchUserData = () => {
    fetch('https://localhost:7069/api/auth/Teachers')
      .then((response) => response.json())
      .then((data) => setUserList(data))
      .catch((error) => console.log(error));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalTitle('');
    setModalAction('');
    setTeacherID('');
    setDepartmentID('');
    setUserID('');
    setOfficeLocation('');
    setOfficeHours('');
    setAcademicRank('');
    setResearchInterests('');
  };

  const handleShowCreateModal = () => {
    setShowModal(true);
    setModalTitle('Create Teacher');
    setModalAction('create');
  };

  const handleShowEditModal = (teacher) => {
    setShowModal(true);
    setModalTitle('Edit Teacher');
    setModalAction('edit');
    setTeacherID(teacher.teacher_id);
    setDepartmentID(teacher.department_id);
    setUserID(teacher.user_id);
    setOfficeLocation(teacher.office_location);
    setOfficeHours(teacher.office_hours);
    setAcademicRank(teacher.academic_rank);
    setResearchInterests(teacher.research_interests);
  };

  const handleCreate = () => {
    // Validation logic
    if (!departmentID || !userID || !officeLocation || !officeHours || !academicRank || !researchInterests) {
      setError('Please fill in all fields.');
      return;
    }

    const newTeacher = {
      department_id: departmentID,
      user_id: userID,
      office_location: officeLocation,
      office_hours: officeHours,
      academic_rank: academicRank,
      research_interests: researchInterests,
    };

    // Check if teacher with the same user already exists
    const existingTeacher = teacherList.find((t) => t.user_id === newTeacher.user_id);
    if (existingTeacher) {
      setError('A teacher with the same user already exists.');
      return;
    }

    fetch('https://localhost:7069/api/Teachers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTeacher),
    })
      .then((response) => response.json())
      .then(() => {
        fetchTeacherData();
        handleCloseModal();
      })
      .catch((error) => console.log(error));
  };

  const handleUpdate = () => {
    // Validation logic
    if (!departmentID || !userID || !officeLocation || !officeHours || !academicRank || !researchInterests) {
      setError('Please fill in all fields.');
      return;
    }

    const updateTeacher = {
      teacher_id: teacherID,
      department_id: departmentID,
      user_id: userID,
      office_location: officeLocation,
      office_hours: officeHours,
      academic_rank: academicRank,
      research_interests: researchInterests,
    };

    fetch(`https://localhost:7069/api/Teachers/${teacherID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateTeacher),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update the record. Please check the console for details.');
        } else {
          fetchTeacherData();
          handleCloseModal();
        }
      })
      .catch((error) => console.log(error));
  };

  const handleForceUpdate = () => {
    setForceUpdate((prev) => !prev);
  };

  const handleDelete = (id) => {
    fetch(`https://localhost:7069/api/Teachers/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete the record.');
        }

        // Check if the response has a content type of 'application/json'
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          // Parse the JSON only if the content type is 'application/json'
          return response.json();
        } else {
          // Return an empty object if there is no JSON content
          return {};
        }
      })
      .then(() => {
        // Remove the deleted teacher from the state
        setTeacherList((prevList) => prevList.filter((teacher) => teacher.teacher_id !== id));
      })
      .catch((error) => console.log(error));
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchText(searchValue);
  };

  const filteredTeacherList = searchText
    ? teacherList.filter((teacher) => teacher.teacher_id.toString().includes(searchText))
    : teacherList;

  return (
    <div className="container mt-5" style={{ marginLeft: '-5vw' }}>
      <h3>Teacher</h3>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by Teacher ID"
          value={searchText}
          onChange={handleSearch}
          className="form-control"
        />
      </div>
      <button className="btn btn-primary mb-3" onClick={handleShowCreateModal}>
        Create Teacher
      </button>

      <h2>Teacher List</h2>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Teacher ID</th>
              <th>User</th>
              <th>Department</th>
              <th>Office Location</th>
              <th>Office Hours</th>
              <th>Academic Rank</th>
              <th>Research Interests</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeacherList.map((teacher) => {
              // Find the corresponding user for the current teacher
              const correspondingUser = userList.find((user) => user.user_id === teacher.user_id);
              // Find the corresponding department for the current teacher
              const correspondingDepartment = departmentList.find(
                (department) => department.department_id === teacher.department_id
              );

              return (
                <tr key={teacher.teacher_id}>
                  <td>{teacher.teacher_id}</td>
                  <td>{correspondingUser ? `${correspondingUser.name} ${correspondingUser.surname}` : ''}</td>
                  <td>{correspondingDepartment ? correspondingDepartment.name : ''}</td>
                  <td>{teacher.office_location}</td>
                  <td>{teacher.office_hours}</td>
                  <td>{teacher.academic_rank}</td>
                  <td>{teacher.research_interests}</td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => handleShowEditModal(teacher)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm ml-2"
                      onClick={() => handleDelete(teacher.teacher_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p className="text-danger">{error}</p>}
          <Form>
            <Form.Group controlId="userID">
              <Form.Label>User ID:</Form.Label>
              <Form.Control as="select" value={userID} onChange={(e) => setUserID(e.target.value)}>
                <option value="">Select User</option>
                {userList.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.name} {user.surname}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="departmentID">
              <Form.Label>Department ID:</Form.Label>
              <Form.Control as="select" value={departmentID} onChange={(e) => setDepartmentID(e.target.value)}>
                <option value="">Select Department</option>
                {departmentList.map((department) => (
                  <option key={department.department_id} value={department.department_id}>
                    {department.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="officeLocation">
              <Form.Label>Office Location:</Form.Label>
              <Form.Control type="text" value={officeLocation} onChange={(e) => setOfficeLocation(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="officeHours">
              <Form.Label>Office Hours:</Form.Label>
              <Form.Control type="text" value={officeHours} onChange={(e) => setOfficeHours(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="academicRank">
              <Form.Label>Academic Rank:</Form.Label>
              <Form.Control type="text" value={academicRank} onChange={(e) => setAcademicRank(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="researchInterests">
              <Form.Label>Research Interests:</Form.Label>
              <Form.Control type="text" value={researchInterests} onChange={(e) => setResearchInterests(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {modalAction === 'create' && (
            <Button variant="primary" onClick={handleCreate}>
              Create
            </Button>
          )}
          {modalAction === 'edit' && (
            <Button variant="primary" onClick={handleUpdate}>
              Update
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Teacher;
