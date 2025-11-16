import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Dayjs from 'dayjs';
import {
  FormControl,
  TextField,
  Button,
  Box,
  MenuItem,
  Autocomplete,
  Alert,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import { useCreateDataEntry } from '../../queryClient/hooks';
import { useParts } from '../../queryClient/hooks';
import { useRejections } from '../../queryClient/hooks';
import type { Entity } from '../common/common.types';
import type { DataEntryDto } from '../../queryClient/endpoints';

const DataEntryContainer: React.FC = () => {
  const [formData, setFormData] = useState({
    date: Dayjs(),
    shift: 'Day',
    inspectorName: '',
    part: null as Entity | null,
    numberOfParts: '',
    rejection: null as Entity | null,
    numberOfRejections: '',
    lotNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: createDataEntry, isPending, isError, error } = useCreateDataEntry();
  const { data: parts = [] } = useParts();
  const { data: rejections = [] } = useRejections();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.inspectorName.trim()) {
      newErrors.inspectorName = 'Inspector name is required';
    }
    if (!formData.part) {
      newErrors.part = 'Please select a part';
    }
    if (!formData.numberOfParts || isNaN(Number(formData.numberOfParts)) || Number(formData.numberOfParts) < 0) {
      newErrors.numberOfParts = 'Please enter a valid number';
    }
    if (!formData.rejection) {
      newErrors.rejection = 'Please select a rejection';
    }
    if (!formData.numberOfRejections || isNaN(Number(formData.numberOfRejections)) || Number(formData.numberOfRejections) < 0) {
      newErrors.numberOfRejections = 'Please enter a valid number';
    }
    if (!formData.lotNumber.trim()) {
      newErrors.lotNumber = 'Lot number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if (!formData.part || !formData.rejection) {
      return;
    }

    const dataEntryDto: DataEntryDto = {
      date: formData.date.toISOString(),
      shift: formData.shift,
      inspectorName: formData.inspectorName,
      part: formData.part.id,
      numberOfParts: Number(formData.numberOfParts),
      rejection: formData.rejection.id,
      numberOfRejections: Number(formData.numberOfRejections),
      lotNumber: formData.lotNumber,
    };

    createDataEntry(dataEntryDto);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      date: Dayjs(),
      shift: 'Day',
      inspectorName: '',
      part: null,
      numberOfParts: '',
      rejection: null,
      numberOfRejections: '',
      lotNumber: '',
    });
    setErrors({});
  };

  return (
    <div>
      <h2>Data Entry</h2>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          maxWidth: 600,
          margin: '0 auto',
          padding: 2,
        }}
      >
        {isError && (
          <Alert severity="error">
            {error instanceof Error ? error.message : 'Failed to create data entry'}
          </Alert>
        )}

        <FormControl fullWidth>
          <DatePicker
            label="Select Date"
            value={formData.date}
            onChange={(newValue) =>
              setFormData({ ...formData, date: newValue || Dayjs() })
            }
            disableFuture
          />
        </FormControl>

        <FormControl fullWidth error={!!errors.shift}>
          <TextField
            select
            label="Enter Shift"
            value={formData.shift}
            onChange={(e) =>
              setFormData({ ...formData, shift: e.target.value })
            }
          >
            <MenuItem value="Day">Day (8 am to 8 pm)</MenuItem>
            <MenuItem value="Night">Night (8 pm to 8 am)</MenuItem>
          </TextField>
          {errors.shift && <FormHelperText>{errors.shift}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth error={!!errors.inspectorName}>
          <TextField
            label="Enter Inspector Name"
            value={formData.inspectorName}
            onChange={(e) =>
              setFormData({ ...formData, inspectorName: e.target.value })
            }
            error={!!errors.inspectorName}
            helperText={errors.inspectorName}
          />
        </FormControl>

        <FormControl fullWidth error={!!errors.part}>
          <Autocomplete
            options={parts}
            getOptionLabel={(option) => option.name}
            value={formData.part}
            onChange={(_, newValue) =>
              setFormData({ ...formData, part: newValue })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Part"
                error={!!errors.part}
                helperText={errors.part}
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth error={!!errors.numberOfParts}>
          <TextField
            label="Number of Parts"
            type="number"
            value={formData.numberOfParts}
            onChange={(e) =>
              setFormData({ ...formData, numberOfParts: e.target.value })
            }
            inputProps={{ min: 0 }}
            error={!!errors.numberOfParts}
            helperText={errors.numberOfParts}
          />
        </FormControl>

        <FormControl fullWidth error={!!errors.rejection}>
          <Autocomplete
            options={rejections}
            getOptionLabel={(option) => option.name}
            value={formData.rejection}
            onChange={(_, newValue) =>
              setFormData({ ...formData, rejection: newValue })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Rejection"
                error={!!errors.rejection}
                helperText={errors.rejection}
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth error={!!errors.numberOfRejections}>
          <TextField
            label="Number of Rejections"
            type="number"
            value={formData.numberOfRejections}
            onChange={(e) =>
              setFormData({ ...formData, numberOfRejections: e.target.value })
            }
            inputProps={{ min: 0 }}
            error={!!errors.numberOfRejections}
            helperText={errors.numberOfRejections}
          />
        </FormControl>

        <FormControl fullWidth error={!!errors.lotNumber}>
          <TextField
            label="Lot Number"
            value={formData.lotNumber}
            onChange={(e) =>
              setFormData({ ...formData, lotNumber: e.target.value })
            }
            error={!!errors.lotNumber}
            helperText={errors.lotNumber}
          />
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={handleReset} variant="outlined">
            Reset
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isPending}
          >
            {isPending ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default DataEntryContainer;