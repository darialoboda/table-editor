import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { createId } from '../types';
import TableRows from './TableRows';

import {
  Typography,
  Box,
  Button,
  Paper,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { useSnackbar } from 'notistack';

const TableManager = () => {
  const { state, dispatch } = useAppState();
  const { enqueueSnackbar } = useSnackbar();

  const [newTableName, setNewTableName] = useState('');
  const [editTableId, setEditTableId] = useState(null);
  const [editTableName, setEditTableName] = useState('');
  const [deleteTableId, setDeleteTableId] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);

  const activeUser = state.users.find((u) => u.id === state.activeUserId);

  const handleAddTable = () => {
    if (!newTableName.trim()) {
      enqueueSnackbar('Table name is required', { variant: 'warning' });
      return;
    }

    if (!activeUser) {
      enqueueSnackbar('Please select an active user first.', { variant: 'error' });
      return;
    }

    const newTable = {
      id: createId(),
      name: newTableName.trim(),
      rows: [],
      createdBy: activeUser.name,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_TABLE', payload: newTable });
    enqueueSnackbar('Table added successfully', { variant: 'success' });
    setNewTableName('');
    setOpenAddModal(false);
  };

  const handleRenameTable = () => {
    if (!editTableName.trim()) return;
    dispatch({
      type: 'UPDATE_TABLE_NAME',
      payload: { id: editTableId, name: editTableName.trim() },
    });
    enqueueSnackbar('Table renamed', { variant: 'success' });
    setEditTableId(null);
    setEditTableName('');
  };

  const handleDeleteTable = () => {
    dispatch({ type: 'DELETE_TABLE', payload: deleteTableId });
    enqueueSnackbar('Table deleted', { variant: 'info' });
    setDeleteTableId(null);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Tables
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenAddModal(true)}
        sx={{ mb: 3 }}
      >
        Add Table
      </Button>

      {state.tables.length === 0 && (
        <Typography>No tables yet.</Typography>
      )}

      <Stack spacing={3}>
        {state.tables.map((table) => (
          <Paper
            key={table.id}
            variant="outlined"
            sx={{ p: 2, position: 'relative' }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={1}
              sx={{ mb: 1 }}
            >
              <Typography variant="h6">{table.name}</Typography>

              <Stack direction="row" spacing={1}>
                <IconButton
                  aria-label="rename table"
                  color="primary"
                  onClick={() => {
                    setEditTableId(table.id);
                    setEditTableName(table.name);
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton
                  aria-label="delete table"
                  color="error"
                  onClick={() => setDeleteTableId(table.id)}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Created by: <strong>{table.createdBy}</strong> on{' '}
              {table.createdAt ? new Date(table.createdAt).toLocaleString() : '-'}
            </Typography>

            <Typography variant="body2" sx={{ mb: 1 }}>
              Rows: {table.rows.length}
            </Typography>

            <TableRows table={table} />
          </Paper>
        ))}
      </Stack>

      {/* Add Modal */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Table</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Table Name"
            fullWidth
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddModal(false)}>Cancel</Button>
          <Button onClick={handleAddTable} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Modal */}
      <Dialog open={!!editTableId} onClose={() => setEditTableId(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Rename Table</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="New Table Name"
            fullWidth
            value={editTableName}
            onChange={(e) => setEditTableName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditTableId(null)}>Cancel</Button>
          <Button onClick={handleRenameTable} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteTableId} onClose={() => setDeleteTableId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this table?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTableId(null)}>Cancel</Button>
          <Button onClick={handleDeleteTable} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableManager;
