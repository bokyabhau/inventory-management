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
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
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
  rejections: Array<{
    reason: {
      id: string;
      name: string;
    };
    numberOfRejections: number;
  }>;
  totalRejections: number;
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
  const [dateTimeRange, setDateTimeRange] = useState<[Dayjs.Dayjs | null, Dayjs.Dayjs | null]>([null, null]);
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
      (sum, entry) => sum + entry.totalRejections,
      0
    );
    const cumulativeRejectionPercentage =
      totalParts > 0 ? (totalRejections / totalParts) * 100 : 0;

    const rejectionReasons: RejectionStats = {};
    (displayData as DataEntry[]).forEach((entry) => {
      entry.rejections.forEach((rejection) => {
        const rejectionName = rejection.reason?.name || 'Unknown';
        if (!rejectionReasons[rejectionName]) {
          rejectionReasons[rejectionName] = { count: 0, percentage: 0 };
        }
        rejectionReasons[rejectionName].count += rejection.numberOfRejections;
      });
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
    
    const [startDateTime, endDateTime] = dateTimeRange;
    
    if (startDateTime) {
      newFilters.startDate = startDateTime.toString();
    }
    
    if (endDateTime) {
      const endDateTimeAdjusted = endDateTime.clone().second(59);
      newFilters.endDate = endDateTimeAdjusted.toString();
    }

    setFilters(newFilters);
    setHasFiltered(true);
  };

  const handleReset = () => {
    setSelectedParts([]);
    setDateTimeRange([null, null]);
    setFilters({});
    setHasFiltered(false);
  };  const exportToExcel = () => {
    const reportData: any[] = [];
    
    (displayData as DataEntry[]).forEach((entry) => {
      if (entry.rejections.length === 0) {
        // If no rejections, create one row without rejection details
        reportData.push({
          Date: Dayjs(entry.date).format('DD/MM/YYYY HH:mm'),
          Shift: entry.shift,
          'Inspector Name': entry.inspectorName,
          Part: entry.part?.name || 'N/A',
          'Number of Parts': entry.numberOfParts,
          Rejection: 'N/A',
          'Number of Rejections': 0,
          'Lot Number': entry.lotNumber,
        });
      } else {
        // For each rejection, create a row
        entry.rejections.forEach((rejection) => {
          reportData.push({
            Date: Dayjs(entry.date).format('DD/MM/YYYY HH:mm'),
            Shift: entry.shift,
            'Inspector Name': entry.inspectorName,
            Part: entry.part?.name || 'N/A',
            'Number of Parts': entry.numberOfParts,
            Rejection: rejection.reason?.name || 'N/A',
            'Number of Rejections': rejection.numberOfRejections,
            'Lot Number': entry.lotNumber,
          });
        });
      }
    });

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

        {/* Date/Time Range Row */}
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <DateTimePicker
              label="Start Date & Time"
              value={dateTimeRange[0]}
              onChange={(newValue: any) =>
                setDateTimeRange([newValue, dateTimeRange[1]])
              }
              slotProps={{ textField: { size: 'small' } }}
              format="DD/MM/YYYY HH:mm"
            />
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <DateTimePicker
              label="End Date & Time"
              value={dateTimeRange[1]}
              onChange={(newValue: any) =>
                setDateTimeRange([dateTimeRange[0], newValue])
              }
              slotProps={{ textField: { size: 'small' } }}
              format="DD/MM/YYYY HH:mm"
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
                    {(displayData as DataEntry[]).map((entry) => {
                      // If no rejections, show one row
                      if (entry.rejections.length === 0) {
                        return (
                          <TableRow key={entry.id} hover>
                            <TableCell>{Dayjs(entry.date).format('DD/MM/YYYY HH:mm')}</TableCell>
                            <TableCell>{entry.shift}</TableCell>
                            <TableCell>{entry.inspectorName}</TableCell>
                            <TableCell>{entry.part?.name || 'N/A'}</TableCell>
                            <TableCell>N/A</TableCell>
                            <TableCell align="right">{entry.numberOfParts}</TableCell>
                            <TableCell align="right">0</TableCell>
                            <TableCell>{entry.lotNumber}</TableCell>
                          </TableRow>
                        );
                      }
                      
                      // For each rejection, show a row
                      return entry.rejections.map((rejection, index) => (
                        <TableRow key={`${entry.id}-${index}`} hover>
                          {index === 0 ? (
                            <>
                              <TableCell>{Dayjs(entry.date).format('DD/MM/YYYY HH:mm')}</TableCell>
                              <TableCell>{entry.shift}</TableCell>
                              <TableCell>{entry.inspectorName}</TableCell>
                              <TableCell>{entry.part?.name || 'N/A'}</TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                            </>
                          )}
                          <TableCell>{rejection.reason?.name || 'N/A'}</TableCell>
                          <TableCell align="right">{index === 0 ? entry.numberOfParts : ''}</TableCell>
                          <TableCell align="right">{rejection.numberOfRejections}</TableCell>
                          <TableCell>{index === 0 ? entry.lotNumber : ''}</TableCell>
                        </TableRow>
                      ));
                    })}
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
