import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Form } from 'react-bootstrap';

const University = () => {
  const [universityList, setUniversityList] = useState([]);
  const [universityID, setUniversityID] = useState('');
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [location, setLocation] = useState('');
  const [websiteURL, setWebsiteURL] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [accreditationStatus, setAccreditationStatus] = useState('');
  const [ranking, setRanking] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalAction, setModalAction] = useState('');
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState('');
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    fetchUniversityData();
  }, [setForceUpdate]);

  const fetchUniversityData = () => {
    fetch('https://localhost:7069/api/University')
      .then((response) => response.json())
      .then((data) => setUniversityList(data))
      .catch((error) => console.log(error));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalTitle('');
    setModalAction('');
    setUniversityID('');
    setName('');
    setAbbreviation('');
    setEstablishedYear('');
    setLocation('');
    setWebsiteURL('');
    setContactEmail('');
    setContactPhone('');
    setAccreditationStatus('');
    setRanking('');
  };

  const handleShowCreateModal = () => {
    setShowModal(true);
    setModalTitle('Create University');
    setModalAction('create');
  };

  const handleShowEditModal = (university) => {
    setShowModal(true);
    setModalTitle('Edit University');
    setModalAction('edit');
    setUniversityID(university.university_id);
    setName(university.name);
    setAbbreviation(university.abbreviation);
    setEstablishedYear(university.established_year);
    setLocation(university.location);
    setWebsiteURL(university.website_url);
    setContactEmail(university.contact_email);
    setContactPhone(university.contact_phone);
    setAccreditationStatus(university.accreditation_status);
    setRanking(university.ranking);
  };

  const handleCreate = () => {
    // Validation logic
    if (!name || !abbreviation || !establishedYear || !location || !websiteURL || !contactEmail || !contactPhone || !accreditationStatus || !ranking) {
      setError('Please fill in all fields.');
      return;
    }
  
    const newUniversity = {
      name: name,
      abbreviation: abbreviation,
      established_year: establishedYear,
      location: location,
      website_url: websiteURL,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      accreditation_status: accreditationStatus,
      ranking: ranking,
    };
  
    // Check if university with the same name already exists
    const existingUniversity = universityList.find(u => u.name.toLowerCase() === newUniversity.name.toLowerCase());
    if (existingUniversity) {
      setError('A university with the same name already exists.');
      return;
    }
  
    fetch('https://localhost:7069/api/University', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUniversity),
    })
      .then((response) => response.json())
      .then(() => {
        fetchUniversityData();
        handleCloseModal();
      })
      .catch((error) => console.log(error));
  };
  
  const handleUpdate = () => {
    // Validation logic
    if (!name || !abbreviation || !establishedYear || !location || !websiteURL || !contactEmail || !contactPhone || !accreditationStatus || !ranking) {
      setError('Please fill in all fields.');
      return;
    }
  
    const updateUniversity = {
      university_id: universityID,
      name: name,
      abbreviation: abbreviation,
      established_year: parseInt(establishedYear),
      location: location,
      website_url: websiteURL,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      accreditation_status: accreditationStatus,
      ranking: parseInt(ranking),
    };
    
    console.log(JSON.stringify(updateUniversity));
    
    fetch(`https://localhost:7069/api/University/${universityID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateUniversity),
    })
      .then((response) => {
        console.log(response); // Log the full response object
  
        // Check if the response indicates an error
        if (!response.ok) {
          // Handle the error here
          setError('Failed to update the record. Please check the console for details.');
        } else {
          // If successful, update the data and close the modal
          fetchUniversityData();
          handleCloseModal();
        }
      })
      .catch((error) => console.log(error));
  };
  
  
  
  
  const handleDelete = (id) => {
    fetch(`https://localhost:7069/api/University/${id}`, {
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
        // Remove the deleted university from the state
        setUniversityList((prevList) => prevList.filter((university) => university.university_id !== id));
      })
      .catch((error) => console.log(error));
  };
  
  
  
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchText(searchValue);
  };
  

  const filteredUniversityList = searchText
    ? universityList.filter((university) => university.university_id.toString().includes(searchText))
    : universityList;

  return (
    <div className="container mt-5" style={{marginLeft:'-5vw'}}>
    <h3>University</h3>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by University ID"
          value={searchText}
          onChange={handleSearch}
          className="form-control"
        />
      </div>
      <button className="btn btn-primary mb-3" onClick={handleShowCreateModal}>
        Create University
      </button>

      <h2>University List</h2>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>University ID</th>
              <th>Name</th>
              <th>Abbreviation</th>
              <th>Established Year</th>
              <th>Location</th>
              <th>Website URL</th>
              <th>Contact Email</th>
              <th>Contact Phone</th>
              <th>Accreditation Status</th>
              <th>Ranking</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUniversityList.map((university) => (
              <tr key={university.university_id}>
                <td>{university.university_id}</td>
                <td>{university.name}</td>
                <td>{university.abbreviation}</td>
                <td>{university.established_year}</td>
                <td>{university.location}</td>
                <td>{university.website_url}</td>
                <td>{university.contact_email}</td>
                <td>{university.contact_phone}</td>
                <td>{university.accreditation_status}</td>
                <td>{university.ranking}</td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => handleShowEditModal(university)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm ml-2" onClick={() => handleDelete(university.university_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
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
            
            <Form.Group controlId="name">
              <Form.Label>Name:</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="abbreviation">
              <Form.Label>Abbreviation:</Form.Label>
              <Form.Control type="text" value={abbreviation} onChange={(e) => setAbbreviation(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="establishedYear">
              <Form.Label>Established Year:</Form.Label>
              <Form.Control
                type="number"
                value={establishedYear}
                onChange={(e) => setEstablishedYear(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="location">
              <Form.Label>Location:</Form.Label>
              <Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="websiteURL">
              <Form.Label>Website URL:</Form.Label>
              <Form.Control type="text" value={websiteURL} onChange={(e) => setWebsiteURL(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="contactEmail">
              <Form.Label>Contact Email:</Form.Label>
              <Form.Control type="text" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="contactPhone">
              <Form.Label>Contact Phone:</Form.Label>
              <Form.Control type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="accreditationStatus">
              <Form.Label>Accreditation Status:</Form.Label>
              <Form.Control type="text" value={accreditationStatus} onChange={(e) => setAccreditationStatus(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="ranking">
              <Form.Label>Ranking:</Form.Label>
              <Form.Control type="number" value={ranking} onChange={(e) => setRanking(e.target.value)} />
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

export default University;
