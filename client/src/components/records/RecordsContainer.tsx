import React, { useState, useMemo } from 'react';
import {
  Box,
  CircularProgress,
  Alert,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Paper,
} from '@mui/material';
import { useDataEntries, usePreferences } from '../../queryClient/hooks';
import Dayjs from 'dayjs';

interface RejectionDetail {
  id: string;
  reason: {
    id: string;
    name: string;
  };
  numberOfRejections: number;
}

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
  rejections: RejectionDetail[];
  totalRejections: number;
  lotNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

const ExpandableRow: React.FC<{ row: DataEntry; warningThreshold: number; dangerThreshold: number }> = ({ row, warningThreshold, dangerThreshold }) => {
  const [open, setOpen] = useState(false);
  const rejectionPercentage = row.numberOfParts > 0 ? (row.totalRejections / row.numberOfParts) * 100 : 0;

  let rowBackgroundColor;
  if (rejectionPercentage >= dangerThreshold) {
    rowBackgroundColor = '#2c0b0e'; // Light red
  } else if (rejectionPercentage >= warningThreshold) {
    rowBackgroundColor = '#332701'; // Light orange
  } else if (rejectionPercentage < warningThreshold) {
    rowBackgroundColor = '#388e3c'; // Default
  }

  const rowStyling = rowBackgroundColor ? { backgroundColor: rowBackgroundColor } : {};

  return (
    <>
      <TableRow hover sx={rowStyling}>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? '▼' : '▶'}
          </IconButton>
        </TableCell>
        <TableCell>{Dayjs(row.date).format('DD/MM/YYYY')}</TableCell>
        <TableCell>{row.shift}</TableCell>
        <TableCell>{row.inspectorName}</TableCell>
        <TableCell>{row.part?.name || 'N/A'}</TableCell>
        <TableCell align="right">{row.numberOfParts}</TableCell>
        <TableCell align="right">{row.totalRejections}</TableCell>
        <TableCell align="right">
          {rejectionPercentage.toFixed(2)}%
        </TableCell>
        <TableCell>{row.lotNumber}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <h4>Rejection Breakdown</h4>
              {row.rejections && row.rejections.length > 0 ? (
                <Table size="small">
                  <TableBody>
                    {row.rejections.map((rejection) => (
                      <TableRow key={rejection.id}>
                        <TableCell>{rejection.reason?.name || 'N/A'}</TableCell>
                        <TableCell align="right">{rejection.numberOfRejections}</TableCell>
                        <TableCell align="right">
                          {row.totalRejections > 0 ? `${((rejection.numberOfRejections / row.totalRejections) * 100).toFixed(2)}%` : '0%'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Alert severity="info">No rejections recorded</Alert>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const RecordsContainer: React.FC = () => {
  const { data: dataEntries = [], isLoading, isError, error } = useDataEntries();
  const { data: preferences = [] } = usePreferences();

  // Extract warning and danger percentages from preferences
  const warningPercentage = useMemo(() => {
    const pref = (preferences as Array<{ name: string; value: string }>).find(p => p.name === 'warningPercentage');
    return pref ? parseFloat(pref.value) : 10; // Default 10%
  }, [preferences]);

  const dangerPercentage = useMemo(() => {
    const pref = (preferences as Array<{ name: string; value: string }>).find(p => p.name === 'dangerPercentage');
    return pref ? parseFloat(pref.value) : 20; // Default 20%
  }, [preferences]);

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
        <Paper>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell style={{ width: '50px' }}></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Shift</strong></TableCell>
                <TableCell><strong>Inspector Name</strong></TableCell>
                <TableCell><strong>Part</strong></TableCell>
                <TableCell align="right"><strong>Number of Parts</strong></TableCell>
                <TableCell align="right"><strong>Total Rejections</strong></TableCell>
                <TableCell align="right"><strong>Rejection %</strong></TableCell>
                <TableCell><strong>Lot Number</strong></TableCell>
              </TableRow>
              {(dataEntries as DataEntry[]).map((entry) => (
                <ExpandableRow key={entry.id} row={entry} warningThreshold={warningPercentage} dangerThreshold={dangerPercentage} />
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </div>
  );
};

export default RecordsContainer;
