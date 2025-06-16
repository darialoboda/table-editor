import React, { useState, useMemo } from 'react';
import { useAppState } from './context/StateContext';
import { SnackbarProvider } from 'notistack';  
import UserManager from './components/UserManager';
import TableManager from './components/TableManager';

import {
  Container,
  Typography,
  Divider,
  Box,
  Paper,
  IconButton,
  Tooltip,
  CssBaseline,
} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

function App() {
  const { state } = useAppState();
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: darkMode ? '#90caf9' : '#1976d2',
          },
          background: {
            default: darkMode ? '#121212' : '#f5f5f5',
            paper: darkMode ? '#1e1e1e' : '#fff',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
      }),
    [darkMode]
  );

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 4, position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                <IconButton onClick={toggleDarkMode} color="primary" size="large">
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
            </Box>

            <Typography variant="h4" component="h1" gutterBottom>
              Table Editor
            </Typography>

            <UserManager />

            <Divider sx={{ my: 4 }} />

            <TableManager />

            <Divider sx={{ my: 4 }} />

            <Typography variant="h5" gutterBottom>
              Stats
            </Typography>

            <Box sx={{ pl: 1 }}>
              <Typography variant="body1">Users: {state.users.length}</Typography>
              <Typography variant="body1">Tables: {state.tables.length}</Typography>
              <Typography variant="body1">
                Active User: {state.activeUserId ?? 'None selected'}
              </Typography>
            </Box>
          </Paper>
        </Container>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
