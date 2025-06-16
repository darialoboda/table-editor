import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { createId } from '../types';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  useTheme,
} from '@mui/material';

const TableRows = ({ table }) => {
  const { state, dispatch } = useAppState();
  const [text, setText] = useState('');
  const theme = useTheme();

  const activeUser = state.users.find((u) => u.id === state.activeUserId);

  const handleAddRow = () => {
    if (!activeUser) {
      alert('Please select an active user first.');
      return;
    }
    if (!text.trim()) {
      alert('Text is required.');
      return;
    }
    if (text.length > 100) {
      alert('Text must be 100 characters or less.');
      return;
    }

    const newRow = {
      id: createId(),
      text: text.trim(),
      createdBy: activeUser.name,
      createdAt: new Date().toISOString(),
      modifiedBy: null,
      modifiedAt: null,
    };

    dispatch({ type: 'ADD_ROW', payload: { tableId: table.id, row: newRow } });
    setText('');
  };

  const handleEditRow = (row) => {
    const newText = prompt('Edit text (max 100 characters):', row.text);
    if (newText && newText.trim() !== row.text) {
      if (newText.length > 100) {
        alert('Text must be 100 characters or less.');
        return;
      }

      const updatedRow = {
        ...row,
        text: newText.trim(),
        modifiedBy: activeUser ? activeUser.name : row.modifiedBy,
        modifiedAt: new Date().toISOString(),
      };

      dispatch({
        type: 'UPDATE_ROW',
        payload: { tableId: table.id, row: updatedRow },
      });
    }
  };

  const handleDeleteRow = (rowId) => {
    if (window.confirm('Delete this row?')) {
      dispatch({ type: 'DELETE_ROW', payload: { tableId: table.id, rowId } });
    }
  };

  // Загальний стиль для всіх клітинок у темній та світлій темах
  const cellStyle = {
    backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#fafafa',
    color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#222',
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Rows
      </Typography>

      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <TextField
          label="Row text (max 100 chars)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          size="small"
          fullWidth
        />
        <Button variant="contained" onClick={handleAddRow}>
          + Add Row
        </Button>
      </Box>

      {table.rows.length === 0 ? (
        <Typography color="text.secondary">No rows yet.</Typography>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table size="small">
            <TableHead>
              <TableRow sx={cellStyle}>
                <TableCell><strong>Text</strong></TableCell>
                <TableCell><strong>Created By</strong></TableCell>
                <TableCell><strong>Created At</strong></TableCell>
                <TableCell><strong>Modified By</strong></TableCell>
                <TableCell><strong>Modified At</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {table.rows.map((row) => (
                <TableRow key={row.id} hover sx={cellStyle}>
                  <TableCell>{row.text}</TableCell>
                  <TableCell>{row.createdBy}</TableCell>
                  <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{row.modifiedBy || '-'}</TableCell>
                  <TableCell>{row.modifiedAt ? new Date(row.modifiedAt).toLocaleString() : '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEditRow(row)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDeleteRow(row.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TableRows;
