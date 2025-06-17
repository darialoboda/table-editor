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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

import { useSnackbar } from 'notistack';

const UserManager = () => {
  const { state, dispatch } = useAppState();
  const { enqueueSnackbar } = useSnackbar();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteId, setOpenDeleteId] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [editingUserId, setEditingUserId] = useState(null);

  const handleOpenAdd = () => {
    setName('');
    setEmail('');
    setOpenAddModal(true);
  };

  const handleAddUser = () => {
    if (!name || !email) {
      enqueueSnackbar('Name and email are required.', { variant: 'warning' });
      return;
    }

    const isDuplicate = state.users.some(
      (u) => u.name === name || u.email === email
    );

    if (isDuplicate) {
      enqueueSnackbar('User with this name or email already exists.', { variant: 'error' });
      return;
    }

    const newUser = { id: createId(), name, email };
    dispatch({ type: 'ADD_USER', payload: newUser });

    setName('');
    setEmail('');
    setOpenAddModal(false);
    enqueueSnackbar('User added successfully.', { variant: 'success' });
  };

  const handleEditInit = (user) => {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setOpenEditModal(true);
  };

  const handleEditSave = () => {
    if (!name || !email) {
      enqueueSnackbar('Both fields are required.', { variant: 'warning' });
      return;
    }

    dispatch({
      type: 'UPDATE_USER',
      payload: {
        id: editingUserId,
        name,
        email,
      },
    });

    setOpenEditModal(false);
    setEditingUserId(null);
    setName('');
    setEmail('');
    enqueueSnackbar('User updated.', { variant: 'info' });
  };

  const handleDeleteConfirm = () => {
    dispatch({ type: 'DELETE_USER', payload: openDeleteId });
    setOpenDeleteId(null);
    enqueueSnackbar('User deleted.', { variant: 'info' });
  };

  const handleChangeActive = (e) => {
    dispatch({ type: 'SET_ACTIVE_USER', payload: e.target.value });
    enqueueSnackbar('Active user changed.', { variant: 'default' });
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

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpenAdd}
        sx={{ mb: 2 }}
      >
        Add User
      </Button>

      {state.users.length === 0 ? (
        <Typography>No users added yet.</Typography>
      ) : (
        <Paper variant="outlined">
          <List dense>
            {state.users.map((user) => (
              <ListItem
                key={user.id}
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEditInit(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => setOpenDeleteId(user.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemText primary={user.name} secondary={user.email} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Add User Modal */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddModal(false)}>Cancel</Button>
          <Button onClick={handleAddUser} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!openDeleteId} onClose={() => setOpenDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManager;
