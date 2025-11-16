import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { useDataEntries } from '../../queryClient/hooks';
import Dayjs from 'dayjs';

interface DataEntry {
  id: string;
  date: string;
  shift: string;
  inspectorName: string;
  part: {
    id: string;
    name: string;
  };
  numberOfParts: number;
  rejection: {
    id: string;
    name: string;
  };
  numberOfRejections: number;
  lotNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

const RecordsContainer: React.FC = () => {
  const { data: dataEntries = [], isLoading, isError, error } = useDataEntries();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        {error instanceof Error ? error.message : 'Failed to load records'}
      </Alert>
    );
  }

  return (
    <div>
      <h2>Data Entry Records</h2>
      {dataEntries.length === 0 ? (
        <Alert severity="info">No data entries found</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow >
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Shift</strong></TableCell>
                <TableCell><strong>Inspector Name</strong></TableCell>
                <TableCell><strong>Part</strong></TableCell>
                <TableCell><strong>Rejection</strong></TableCell>
                <TableCell align="right"><strong>Number of Parts</strong></TableCell>
                <TableCell align="right"><strong>Number of Rejections</strong></TableCell>
                <TableCell><strong>Lot Number</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataEntries.map((entry: DataEntry) => (
                <TableRow key={entry.id} hover>
                  <TableCell>
                    {Dayjs(entry.date).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>{entry.shift}</TableCell>
                  <TableCell>{entry.inspectorName}</TableCell>
                  <TableCell>{entry.part?.name || 'N/A'}</TableCell>
                  <TableCell>{entry.rejection?.name || 'N/A'}</TableCell>
                  <TableCell align="right">{entry.numberOfParts}</TableCell>
                  <TableCell align="right">{entry.numberOfRejections}</TableCell>
                  <TableCell>{entry.lotNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default RecordsContainer;
