import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const App = () => {
  const [users, setUsers] = useState([]); // Users list state
  const [newUser, setNewUser] = useState({ first_name: '', last_name: '', email: '' }); // New user input state
  const [updateUserData, setUpdateUserData] = useState({ id: null, first_name: '', last_name: '', email: '' }); // State for updating a user

  const [openDialog, setOpenDialog] = useState(false); // State for controlling the confirmation dialog
  const [userIdToDelete, setUserIdToDelete] = useState(null); // Store user ID to be deleted

  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' }); // Snackbar state

  // Fetch users (Read)
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://reqres.in/api/users?page=2');
      if (response.data && response.data.data) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Add new user (Create)
  const addUser = async () => {
    try {
      const response = await axios.post('https://reqres.in/api/users', newUser);
      setUsers([...users, response.data]);
      setNewUser({ first_name: '', last_name: '', email: '' }); // Reset input fields
      setAlert({ open: true, message: 'User created successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error adding user:', error);
      setAlert({ open: true, message: 'Failed to create user.', severity: 'error' });
    }
  };

  // Update a user (Update)
  const updateUser = async () => {
    if (updateUserData.id === null) return;
    try {
      const response = await axios.put(`https://reqres.in/api/users/${updateUserData.id}`, updateUserData);
      setUsers(users.map(user => user.id === updateUserData.id ? response.data : user));
      setUpdateUserData({ id: null, first_name: '', last_name: '', email: '' });
      setAlert({ open: true, message: 'User updated successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error updating user:', error);
      setAlert({ open: true, message: 'Failed to update user.', severity: 'error' });
    }
  };

  // Delete a user (Delete)
  const deleteUser = async () => {
    if (userIdToDelete !== null) {
      try {
        await axios.delete(`https://reqres.in/api/users/${userIdToDelete}`);
        setUsers(users.filter(user => user.id !== userIdToDelete));
        setUserIdToDelete(null);
        setOpenDialog(false);
        setAlert({ open: true, message: 'User deleted successfully!', severity: 'success' });
      } catch (error) {
        console.error('Error deleting user:', error);
        setAlert({ open: true, message: 'Failed to delete user.', severity: 'error' });
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom align="center">
        CRUD with API
      </Typography>

      {/* Input Form */}
      <Grid container spacing={2} direction="column" alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h6">{updateUserData.id ? 'Update User' : 'Add New User'}</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            value={updateUserData.id ? updateUserData.first_name : newUser.first_name}
            onChange={(e) => {
              if (updateUserData.id) {
                setUpdateUserData({ ...updateUserData, first_name: e.target.value });
              } else {
                setNewUser({ ...newUser, first_name: e.target.value });
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            value={updateUserData.id ? updateUserData.last_name : newUser.last_name}
            onChange={(e) => {
              if (updateUserData.id) {
                setUpdateUserData({ ...updateUserData, last_name: e.target.value });
              } else {
                setNewUser({ ...newUser, last_name: e.target.value });
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={updateUserData.id ? updateUserData.email : newUser.email}
            onChange={(e) => {
              if (updateUserData.id) {
                setUpdateUserData({ ...updateUserData, email: e.target.value });
              } else {
                setNewUser({ ...newUser, email: e.target.value });
              }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={updateUserData.id ? updateUser : addUser}
            fullWidth
          >
            {updateUserData.id ? 'Update User' : 'Add User'}
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} style={{ marginTop: '30px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>First Name</strong></TableCell>
              <TableCell><strong>Last Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => setUpdateUserData({ id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email })}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setUserIdToDelete(user.id);
                      setOpenDialog(true);
                    }}
                    style={{ marginLeft: '10px' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default App;
