import { Routes, Route, Navigate } from 'react-router-dom';
import { Fragment } from '@emotion/react/jsx-dev-runtime';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import PartsContainer from './components/parts/PartsContainer';
import RejectionsContainer from './components/rejections/RejectionsContainer';
import DataEntryContainer from './components/dataEntry/DataEntryContainer';
import RecordsContainer from './components/records/RecordsContainer';
import SideNav from './components/SideNav';
import RouteChangeLogger from './components/RouteChangeLogger';

export default function App() {
  return (
    <Fragment>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div">
            Inventory Management
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} style={{ padding: '20px' }}>
        <RouteChangeLogger />
        <Grid size={2}>
          <SideNav />
        </Grid>
        <Grid size={10}>
          <Paper style={{ padding: '20px', minHeight: '80vh' }}>
            <Routes>
              <Route path="/data-entry" element={<DataEntryContainer />} />
              <Route path="/records" element={<RecordsContainer />} />
              <Route path="/parts" element={<PartsContainer />} />
              <Route path="/rejections" element={<RejectionsContainer />} />
              <Route path="/" element={<Navigate to="/data-entry" replace />} />
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
}
