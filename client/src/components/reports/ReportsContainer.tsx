import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  FormControl,
  TextField,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Dayjs from 'dayjs';
import { useParts } from '../../queryClient/hooks';
import { useFilterDataEntries } from '../../queryClient/hooks';
import type { FilterDataEntriesParams } from '../../queryClient/endpoints';
import * as XLSX from 'xlsx';

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
}

interface RejectionStats {
  [key: string]: {
    count: number;
    percentage: number;
  };
}

const ReportsContainer: React.FC = () => {
  const [filters, setFilters] = useState<FilterDataEntriesParams>({});
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Dayjs.Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs.Dayjs>(Dayjs());
  const [endTime, setEndTime] = useState<Dayjs.Dayjs>(Dayjs());
  const [hasFiltered, setHasFiltered] = useState(false);

  const { data: parts = [] } = useParts();
  const { data: filteredData = [] } = useFilterDataEntries(filters);

  const displayData = hasFiltered ? filteredData : [];

  const statistics = useMemo(() => {
    if (displayData.length === 0) {
      return {
        totalParts: 0,
        totalRejections: 0,
        cumulativeRejectionPercentage: 0,
        rejectionReasons: {} as RejectionStats,
      };
    }

    const totalParts = (displayData as DataEntry[]).reduce(
      (sum, entry) => sum + entry.numberOfParts,
      0
    );
    const totalRejections = (displayData as DataEntry[]).reduce(
      (sum, entry) => sum + entry.numberOfRejections,
      0
    );
    const cumulativeRejectionPercentage =
      totalParts > 0 ? (totalRejections / totalParts) * 100 : 0;

    const rejectionReasons: RejectionStats = {};
    (displayData as DataEntry[]).forEach((entry) => {
      const rejectionName = entry.rejection?.name || 'Unknown';
      if (!rejectionReasons[rejectionName]) {
        rejectionReasons[rejectionName] = { count: 0, percentage: 0 };
      }
      rejectionReasons[rejectionName].count += entry.numberOfRejections;
    });

    Object.keys(rejectionReasons).forEach((reason) => {
      rejectionReasons[reason].percentage =
        totalRejections > 0
          ? (rejectionReasons[reason].count / totalRejections) * 100
          : 0;
    });

    return {
      totalParts,
      totalRejections,
      cumulativeRejectionPercentage,
      rejectionReasons,
    };
  }, [displayData]);

  const handleFilter = () => {
    if (selectedParts.length === 0) return;

    const newFilters: FilterDataEntriesParams = {};
    
    if (selectedParts.length > 0) {
      newFilters.partName = selectedParts.join(',');
    }
    
    if (startDate) {
      const startDateTime = startDate.clone();
      if (startTime) {
        startDateTime.hour(startTime.hour()).minute(startTime.minute()).second(0);
      }
      newFilters.startDate = startDateTime.toISOString();
    }
    
    if (endDate) {
      const endDateTime = endDate.clone();
      if (endTime) {
        endDateTime.hour(endTime.hour()).minute(endTime.minute()).second(59);
      }
      newFilters.endDate = endDateTime.toISOString();
    }

    setFilters(newFilters);
    setHasFiltered(true);
  };

  const handleReset = () => {
    setSelectedParts([]);
    setStartDate(null);
    setStartTime(null);
    setEndDate(Dayjs());
    setEndTime(Dayjs());
    setFilters({});
    setHasFiltered(false);
  };  const exportToExcel = () => {
    const reportData = (displayData as DataEntry[]).map((entry) => ({
      Date: Dayjs(entry.date).format('DD/MM/YYYY HH:mm'),
      Shift: entry.shift,
      'Inspector Name': entry.inspectorName,
      Part: entry.part?.name || 'N/A',
      'Number of Parts': entry.numberOfParts,
      Rejection: entry.rejection?.name || 'N/A',
      'Number of Rejections': entry.numberOfRejections,
      'Lot Number': entry.lotNumber,
    }));

    const summaryData = [
      { Metric: 'Total Parts', Value: statistics.totalParts },
      { Metric: 'Total Rejections', Value: statistics.totalRejections },
      {
        Metric: 'Cumulative Rejection %',
        Value: statistics.cumulativeRejectionPercentage.toFixed(2) + '%',
      },
      { Metric: '', Value: '' },
      { 'Rejection Reason': 'Count', Percentage: 'Percentage' },
      ...Object.entries(statistics.rejectionReasons).map(([reason, stats]) => ({
        'Rejection Reason': reason,
        Count: stats.count,
        Percentage: stats.percentage.toFixed(2) + '%',
      })),
    ];

    const workbook = XLSX.utils.book_new();
    const dataSheet = XLSX.utils.json_to_sheet(reportData);
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);

    XLSX.utils.book_append_sheet(workbook, dataSheet, 'Data Entries');
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    XLSX.writeFile(
      workbook,
      `rejection_report_${Dayjs().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`
    );
  };

  return (
    <div>
      <h2>Reports</h2>

      <Box sx={{ marginBottom: 3, padding: 2, borderRadius: 1 }}>
        {/* Part Selection Row */}
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <FormControl sx={{ minWidth: 300 }}>
            <Autocomplete
              multiple
              options={parts.map((part) => part.name)}
              value={selectedParts}
              onChange={(_, newValue) => setSelectedParts(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Select Parts" size="small" />
              )}
            />
          </FormControl>
        </Box>

        {/* Start Date and Time Row */}
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <FormControl sx={{ minWidth: 150 }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { size: 'small' } }}
              disableFuture
              format='DD-MMM-YYYY'
            />
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              slotProps={{ textField: { size: 'small' } }}
            />
          </FormControl>
        </Box>

        {/* End Date and Time Row */}
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <FormControl sx={{ minWidth: 150 }}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue || Dayjs())}
              slotProps={{ textField: { size: 'small' } }}
              disableFuture
              format='DD-MMM-YYYY'
            />
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue || Dayjs())}
              slotProps={{ textField: { size: 'small' } }}
            />
          </FormControl>
        </Box>

        {/* Buttons Row */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            onClick={handleFilter} 
            variant="contained"
            disabled={selectedParts.length === 0}
          >
            Apply Filters
          </Button>
          <Button onClick={handleReset} variant="outlined">
            Reset
          </Button>
          {hasFiltered && displayData.length > 0 && (
            <Button onClick={exportToExcel} variant="contained" color="success">
              Export to Excel
            </Button>
          )}
        </Box>
      </Box>

      {hasFiltered && (
        <>
          <Box sx={{ marginBottom: 3, padding: 2, borderRadius: 1 }}>
            <h3>Summary Statistics</h3>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
              <Box>
                <strong>Total Parts:</strong> {statistics.totalParts}
              </Box>
              <Box>
                <strong>Total Rejections:</strong> {statistics.totalRejections}
              </Box>
              <Box>
                <strong>Cumulative Rejection %:</strong>{' '}
                {statistics.cumulativeRejectionPercentage.toFixed(2)}%
              </Box>
            </Box>

            <h4 style={{ marginTop: '1rem' }}>Rejection Breakdown by Reason:</h4>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow >
                    <TableCell><strong>Rejection Reason</strong></TableCell>
                    <TableCell align="right"><strong>Count</strong></TableCell>
                    <TableCell align="right"><strong>Percentage</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(statistics.rejectionReasons).map(([reason, stats]) => (
                    <TableRow key={reason}>
                      <TableCell>{reason}</TableCell>
                      <TableCell align="right">{stats.count}</TableCell>
                      <TableCell align="right">{stats.percentage.toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {displayData.length === 0 ? (
            <Alert severity="info">No data entries match the selected filters</Alert>
          ) : (
            <Box>
              <h3>Filtered Data Entries ({displayData.length})</h3>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
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
                    {(displayData as DataEntry[]).map((entry) => (
                      <TableRow key={entry.id} hover>
                        <TableCell>{Dayjs(entry.date).format('DD/MM/YYYY HH:mm')}</TableCell>
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
            </Box>
          )}
        </>
      )}

      {!hasFiltered && (
        <Alert severity="info">
          Set filters and click "Apply Filters" to view the report
        </Alert>
      )}
    </div>
  );
};

export default ReportsContainer;
