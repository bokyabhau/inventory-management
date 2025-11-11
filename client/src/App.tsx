import Grid from '@mui/material/Grid';
import { Paper } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import PartsContainer from './components/parts/PartsContainer';
import RejectionsContainer from './components/rejections/RejectionsContainer';
import DataEntryContainer from './components/dataEntry/DataEntryContainer';
import SideNav from './components/SideNav';
import RouteChangeLogger from './components/RouteChangeLogger';

export default function App() {
  return (
    <Grid container spacing={2} style={{ padding: '20px' }}>
      <RouteChangeLogger />
      <Grid size={2}>
        <SideNav />
      </Grid>
      <Grid size={10}>
        <Paper style={{ padding: '20px', minHeight: '80vh' }}>
          <Routes>
            <Route path="/data-entry" element={<DataEntryContainer />} />
            <Route path="/parts" element={<PartsContainer />} />
            <Route path="/rejections" element={<RejectionsContainer />} />
            <Route path="/" element={<Navigate to="/data-entry" replace />} />
          </Routes>
        </Paper>
      </Grid>
    </Grid>
  );
}
