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
} from '@mui/material';

import { useSnackbar } from 'notistack';

const TableRows = ({ table }) => {
  const { state, dispatch } = useAppState();
  const [text, setText] = useState('');
  const [filterText, setFilterText] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
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
    enqueueSnackbar('Row added successfully.', { variant: 'success' });
  };

  const handleEditRow = (row) => {
    const newText = prompt('Edit text (max 100 characters):', row.text);
    if (newText && newText.trim() !== row.text) {
      if (newText.length > 100) {
        enqueueSnackbar('Text must be 100 characters or less.', { variant: 'error' });
        return;
      }

      const updatedRow = {
        ...row,
        text: newText.trim(),
        modifiedBy: activeUser ? activeUser.name : row.modifiedBy,
        modifiedAt: new Date().toISOString(),
      };

      dispatch({ type: 'UPDATE_ROW', payload: { tableId: table.id, row: updatedRow } });
      enqueueSnackbar('Row updated successfully.', { variant: 'info' });
    }
  };

  const handleDeleteRow = (rowId) => {
    // Просте підтвердження через window.confirm, але з нотифікацією замість alert
    if (window.confirm('Delete this row?')) {
      dispatch({ type: 'DELETE_ROW', payload: { tableId: table.id, rowId } });
      enqueueSnackbar('Row deleted.', { variant: 'warning' });
    }
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

      <Box display="flex" gap={2} alignItems="center" mb={2} flexWrap="wrap">
        <TextField
          label="Row text (max 100 chars)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, minWidth: '200px' }}
        />
        <Button variant="contained" onClick={handleAddRow}>
          + Add Row
        </Button>
      </Box>

      <Box display="flex" gap={2} alignItems="center" mb={2} flexWrap="wrap">
        <TextField
          label="Search text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
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
