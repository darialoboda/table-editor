import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { createId } from '../types';

import {
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Paper,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

const UserManager = () => {
  const { state, dispatch } = useAppState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleAddUser = () => {
    if (!name || !email) {
      alert('Name and email are required.');
      return;
    }

    const isDuplicate = state.users.some(
      (u) => u.name === name || u.email === email
    );

    if (isDuplicate) {
      alert('User with this name or email already exists.');
      return;
    }

    const newUser = { id: createId(), name, email };
    dispatch({ type: 'ADD_USER', payload: newUser });

    setName('');
    setEmail('');
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch({ type: 'DELETE_USER', payload: id });
    }
  };

  const handleChangeActive = (e) => {
    dispatch({ type: 'SET_ACTIVE_USER', payload: e.target.value });
  };

  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" gutterBottom>
        User Management
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="active-user-label">Active User</InputLabel>
        <Select
          labelId="active-user-label"
          value={state.activeUserId || ''}
          label="Active User"
          onChange={handleChangeActive}
        >
          <MenuItem value="" disabled>
            Select a user
          </MenuItem>
          {state.users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name} ({user.email})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          fullWidth
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          fullWidth
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddUser}
          sx={{ minWidth: 150 }}
        >
          Add User
        </Button>
      </Stack>

      {state.users.length === 0 ? (
        <Typography>No users added yet.</Typography>
      ) : (
        <Paper variant="outlined">
          <List dense>
            {state.users.map((user) => (
              <ListItem
                key={user.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={user.name}
                  secondary={user.email}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default UserManager;
