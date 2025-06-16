import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { createId } from '../types';
import TableRows from './TableRows';

import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Stack,
  IconButton,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useSnackbar } from 'notistack';

const TableManager = () => {
  const { state, dispatch } = useAppState();
  const [newTableName, setNewTableName] = useState('');
  const { enqueueSnackbar } = useSnackbar();

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
    setNewTableName('');
    enqueueSnackbar('Table added successfully', { variant: 'success' });
  };

  const handleDeleteTable = (id) => {
    if (window.confirm('Delete this table?')) {
      dispatch({ type: 'DELETE_TABLE', payload: id });
      enqueueSnackbar('Table deleted', { variant: 'info' });
    }
  };

  const handleRenameTable = (id, currentName) => {
    const newName = prompt('Enter new table name', currentName);
    if (newName && newName.trim()) {
      dispatch({ type: 'UPDATE_TABLE_NAME', payload: { id, name: newName.trim() } });
      enqueueSnackbar('Table renamed', { variant: 'success' });
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Tables
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="New table name"
          variant="outlined"
          value={newTableName}
          onChange={(e) => setNewTableName(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTable}
          sx={{ minWidth: 150 }}
        >
          + Add Table
        </Button>
      </Stack>

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
                  onClick={() => handleRenameTable(table.id, table.name)}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton
                  aria-label="delete table"
                  color="error"
                  onClick={() => handleDeleteTable(table.id)}
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
    </Box>
  );
};

export default TableManager;
