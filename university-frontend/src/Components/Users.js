import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const Users = () => {
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError(''); // Reset error when closing the modal
    setEditUserId(null); // Reset editUserId when closing the modal
    // Reset form fields
    setUserName('');
    setName('');
    setSurname('');
    setPassword('');
    setRole('');
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchRoles = () => {
    setLoadingRoles(true);
    fetch('https://localhost:7069/api/Role')
      .then((response) => response.json())
      .then((data) => setRoles(data))
      .catch((err) => console.error('Error fetching roles:', err))
      .finally(() => setLoadingRoles(false));
  };

  const fetchUsers = () => {
    setLoading(true);
    fetch('https://localhost:7069/api/Auth')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Error fetching users:', err))
      .finally(() => setLoading(false));
  };

  const handleCreateUser = () => {
    // Validation logic
    if (!userName || !name || !surname || !password || !role) {
      setError('Please fill in all fields.');
      return;
    }

    const newUser = {
      UserName: userName,
      name: name,
      surname: surname,
      Password: password,
      Role: role,
    };

    fetch('https://localhost:7069/api/Auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then(() => {
        console.log('User created successfully');
        fetchUsers();
        handleCloseModal();
      })
      .catch((err) => {
        console.error('Error creating user:', err);
        setError('Failed to create user. Please check the console for details.');
      });
  };

  const handleShowEditModal = (userId) => {
    setEditUserId(userId);
    setShowModal(true);

    // Find the user with the given userId
    const userToEdit = users.find((user) => user.user_id === userId);

    // Pre-fill the form fields with existing user data
    if (userToEdit) {
      setUserName(userToEdit.username);
      setName(userToEdit.name);
      setSurname(userToEdit.surname);
      // Displaying an empty string for the password for security reasons
      setPassword('');
      setRole(userToEdit.roleName);
    }
  };

  const handleUpdateUser = () => {
    if (!editUserId) {
      console.error('No user ID provided for update.');
      return;
    }

    const updatedUser = {
      UserName: userName,
      name: name,
      surname: surname,
      Password: password, // Include password in the update
      Role: role,
    };

    fetch(`https://localhost:7069/api/Auth/${editUserId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then(() => {
        console.log(`User with ID ${editUserId} updated successfully`);
        fetchUsers();
        handleCloseModal();
      })
      .catch((err) => {
        console.error('Error updating user:', err);
        setError('Failed to update user. Please check the console for details.');
      });
  };

  const handleDeleteUser = (userId) => {
    fetch(`https://localhost:7069/api/Auth/${userId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete the user.');
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        } else {
          return {};
        }
      })
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== userId));
        console.log('User deleted successfully');
      })
      .catch((err) => console.error('Error deleting user:', err));
  };

  return (
    <div className="container mt-5" style={{ marginLeft: '-5vw' }}>
      <h3>Create/Edit User</h3>
      {error && <p className="text-danger">{error}</p>}
      <button type="button" className="btn btn-primary" onClick={handleShowModal}>
        Create User
      </button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editUserId ? 'Edit User' : 'Create User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p className="text-danger">{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Form>
              <Form.Group controlId="userName">
                <Form.Label>Username:</Form.Label>
                <Form.Control type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="name">
                <Form.Label>Name:</Form.Label>
                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="surname">
                <Form.Label>Surname:</Form.Label>
                <Form.Control type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password:</Form.Label>
                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="role">
                <Form.Label>Role:</Form.Label>
                <Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.roleId} value={role.roleName}>
                      {role.roleName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={editUserId ? handleUpdateUser : handleCreateUser}>
            {editUserId ? 'Update User' : 'Create User'}
          </Button>
        </Modal.Footer>
      </Modal>

      <h3>User List</h3>
      <table className="table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Password</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6">Loading...</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.username}</td>
                <td>{user.name}</td>
                <td>{user.surname}</td>
                <td>{user.password ? '*****' : ''}</td>
                <td>{user.roleName}</td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => handleShowEditModal(user.user_id)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm ml-2" onClick={() => handleDeleteUser(user.user_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
