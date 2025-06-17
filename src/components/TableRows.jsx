import React, { useState, useMemo } from 'react';
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { useSnackbar } from 'notistack';

const TableRows = ({ table }) => {
  const { state, dispatch } = useAppState();
  const [text, setText] = useState('');
  const [filterText, setFilterText] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editText, setEditText] = useState('');
  const [deleteRowId, setDeleteRowId] = useState(null);

  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const activeUser = state.users.find((u) => u.id === state.activeUserId);

  const handleAddRow = () => {
    if (!activeUser) {
      enqueueSnackbar('Please select an active user first.', { variant: 'warning' });
      return;
    }
    if (!text.trim()) {
      enqueueSnackbar('Text is required.', { variant: 'error' });
      return;
    }
    if (text.length > 100) {
      enqueueSnackbar('Text must be 100 characters or less.', { variant: 'error' });
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
    setOpenAddModal(false);
    enqueueSnackbar('Row added successfully.', { variant: 'success' });
  };

  const handleSort = (key) => {
    const isAsc = sortConfig.key === key && sortConfig.direction === 'asc';
    setSortConfig({ key, direction: isAsc ? 'desc' : 'asc' });
  };

  const filteredAndSortedRows = useMemo(() => {
    return [...table.rows]
      .filter((row) => {
        return (
          (!filterText || row.text.toLowerCase().includes(filterText.toLowerCase())) &&
          (!filterUser || row.createdBy === filterUser)
        );
      })
      .sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        if (sortConfig.key.includes('At')) {
          return sortConfig.direction === 'asc'
            ? new Date(aValue) - new Date(bValue)
            : new Date(bValue) - new Date(aValue);
        } else {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
      });
  }, [table.rows, filterText, filterUser, sortConfig]);

  const cellStyle = {
    backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#fafafa',
    color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#222',
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Rows
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={2} flexWrap="wrap" gap={2}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="Search text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            size="small"
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Filter by User</InputLabel>
            <Select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              label="Filter by User"
            >
              <MenuItem value="">All</MenuItem>
              {Array.from(new Set(table.rows.map((r) => r.createdBy))).map((user) => (
                <MenuItem key={user} value={user}>{user}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button variant="contained" onClick={() => setOpenAddModal(true)}>
          + Add Row
        </Button>
      </Box>

      {filteredAndSortedRows.length === 0 ? (
        <Typography color="text.secondary">No rows match your filter.</Typography>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table size="small">
            <TableHead>
              <TableRow sx={cellStyle}>
                {['text', 'createdBy', 'createdAt', 'modifiedBy', 'modifiedAt'].map((col) => (
                  <TableCell key={col}>
                    <TableSortLabel
                      active={sortConfig.key === col}
                      direction={sortConfig.direction}
                      onClick={() => handleSort(col)}
                    >
                      <strong>{
                        col === 'text' ? 'Text'
                          : col === 'createdBy' ? 'Created By'
                          : col === 'createdAt' ? 'Created At'
                          : col === 'modifiedBy' ? 'Modified By'
                          : 'Modified At'
                      }</strong>
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedRows.map((row) => (
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

      {/* Add Row Modal */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Row</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Row text (max 100 characters)"
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            inputProps={{ maxLength: 100 }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddModal(false)}>Cancel</Button>
          <Button onClick={handleAddRow} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Row Modal */}
      <Dialog open={Boolean(editRow)} onClose={() => setEditRow(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Row</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Row text (max 100 characters)"
            fullWidth
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            inputProps={{ maxLength: 100 }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditRow(null)}>Cancel</Button>
          <Button
            onClick={() => {
              if (!editText.trim()) {
                enqueueSnackbar('Text is required.', { variant: 'error' });
                return;
              }
              if (editText.length > 100) {
                enqueueSnackbar('Text must be 100 characters or less.', { variant: 'error' });
                return;
              }

              const updatedRow = {
                ...editRow,
                text: editText.trim(),
                modifiedBy: activeUser ? activeUser.name : editRow.modifiedBy,
                modifiedAt: new Date().toISOString(),
              };

              dispatch({ type: 'UPDATE_ROW', payload: { tableId: table.id, row: updatedRow } });
              enqueueSnackbar('Row updated successfully.', { variant: 'info' });
              setEditRow(null);
            }}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={Boolean(deleteRowId)} onClose={() => setDeleteRowId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this row?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteRowId(null)}>Cancel</Button>
          <Button
            onClick={() => {
              dispatch({ type: 'DELETE_ROW', payload: { tableId: table.id, rowId: deleteRowId } });
              enqueueSnackbar('Row deleted.', { variant: 'warning' });
              setDeleteRowId(null);
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableRows;
