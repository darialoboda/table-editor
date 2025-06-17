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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const TableRows = ({ table }) => {
  const { state, dispatch } = useAppState();
  const [text, setText] = useState('');
  const [editRow, setEditRow] = useState(null); // row object
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [editText, setEditText] = useState('');
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

  const handleEditSave = () => {
    if (!editText.trim()) return;
    if (editText.length > 100) {
      alert('Text must be 100 characters or less.');
      return;
    }

    const updatedRow = {
      ...editRow,
      text: editText.trim(),
      modifiedBy: activeUser ? activeUser.name : editRow.modifiedBy,
      modifiedAt: new Date().toISOString(),
    };

    dispatch({
      type: 'UPDATE_ROW',
      payload: { tableId: table.id, row: updatedRow },
    });

    setEditRow(null);
    setEditText('');
  };

  const handleDeleteConfirm = () => {
    dispatch({ type: 'DELETE_ROW', payload: { tableId: table.id, rowId: deleteRowId } });
    setDeleteRowId(null);
  };

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
                      onClick={() => {
                        setEditRow(row);
                        setEditText(row.text);
                      }}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => setDeleteRowId(row.id)}
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

      {/* Edit Modal */}
      <Dialog open={!!editRow} onClose={() => setEditRow(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Row</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="New Text"
            fullWidth
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditRow(null)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteRowId} onClose={() => setDeleteRowId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this row?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteRowId(null)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableRows;
