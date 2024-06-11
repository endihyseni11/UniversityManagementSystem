import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Form } from 'react-bootstrap';

const Role = () => {
  const [roleList, setRoleList] = useState([]);
  const [roleId, setRoleId] = useState('');
  const [roleName, setRoleName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalAction, setModalAction] = useState('');
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState('');
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    fetchRoleData();
  }, [setForceUpdate]);

  const fetchRoleData = () => {
    fetch('https://localhost:7069/api/Role')
      .then((response) => response.json())
      .then((data) => setRoleList(data))
      .catch((error) => console.log(error));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalTitle('');
    setModalAction('');
    setRoleId('');
    setRoleName('');
  };

  const handleShowCreateModal = () => {
    setShowModal(true);
    setModalTitle('Create Role');
    setModalAction('create');
  };

  const handleShowEditModal = (role) => {
    setShowModal(true);
    setModalTitle('Edit Role');
    setModalAction('edit');
    setRoleId(role.roleId);
    setRoleName(role.roleName);
  };

  const handleCreate = () => {
    // Validation logic
    if (!roleName) {
      setError('Please fill in all fields.');
      return;
    }

    const newRole = {
      roleName: roleName,
    };

    // Check if role with the same name already exists
    const existingRole = roleList.find((r) => r.roleName.toLowerCase() === newRole.roleName.toLowerCase());
    if (existingRole) {
      setError('A role with the same name already exists.');
      return;
    }

    fetch('https://localhost:7069/api/Role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRole),
    })
      .then((response) => response.json())
      .then(() => {
        fetchRoleData();
        handleCloseModal();
      })
      .catch((error) => console.log(error));
  };

  const handleUpdate = () => {
    // Validation logic
    if (!roleName) {
      setError('Please fill in all fields.');
      return;
    }

    const updateRole = {
      roleId: roleId,
      roleName: roleName,
    };

    fetch(`https://localhost:7069/api/Role/${roleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateRole),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update the record. Please check the console for details.');
        } else {
          fetchRoleData();
          handleCloseModal();
        }
      })
      .catch((error) => console.log(error));
  };

  const handleForceUpdate = () => {
    setForceUpdate((prev) => !prev);
  };

  const handleDelete = (id) => {
    fetch(`https://localhost:7069/api/Role/${id}`, {
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
        // Remove the deleted role from the state
        setRoleList((prevList) => prevList.filter((role) => role.roleId !== id));
      })
      .catch((error) => console.log(error));
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchText(searchValue);
  };

  const filteredRoleList = searchText
    ? roleList.filter((role) => role.roleId.toString().includes(searchText) || role.roleName.toLowerCase().includes(searchText))
    : roleList;

  return (
    <div className="container mt-5" style={{ marginLeft: '-5vw' }}>
      <h3>Role</h3>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by Role ID or Role Name"
          value={searchText}
          onChange={handleSearch}
          className="form-control"
        />
      </div>
      <button className="btn btn-primary mb-3" onClick={handleShowCreateModal}>
        Create Role
      </button>

      <h2>Role List</h2>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Role ID</th>
              <th>Role Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoleList.map((role) => (
              <tr key={role.roleId}>
                <td>{role.roleId}</td>
                <td>{role.roleName}</td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => handleShowEditModal(role)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm ml-2" onClick={() => handleDelete(role.roleId)}>
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
            <Form.Group controlId="roleName">
              <Form.Label>Role Name:</Form.Label>
              <Form.Control type="text" value={roleName} onChange={(e) => setRoleName(e.target.value)} />
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

export default Role;
