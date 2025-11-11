import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  type SxProps,
} from '@mui/material';
import { useCreatePart } from '../../queryClient/hooks';
import { useState } from 'react';

const containerStyle: Partial<SxProps> = {
  p: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  width: 400,
};

type CreateEditPartProps = {
  name?: string;
  mode?: 'create' | 'edit';
  id?: string;
};

const CreateEditPart = ({name = '', mode = 'create'}: CreateEditPartProps) => {
  const [partName, setPartName] = useState(name);
  const { mutate, isError, error } = useCreatePart();
  const theMode  = useState(mode);

  console.log(theMode)

  const handleCreatePart = () => {
    // Logic to create part goes here
    mutate({ name: partName });
    setPartName('');
  };

  return (
    <Grid container>
      <Grid size={12}>
        <Paper component="form" sx={containerStyle}>
          <FormControl
            fullWidth
            error={isError}
            variant="outlined"
            sx={{ p: 2, gap: 2 }}
          >
            <TextField
              error={isError}
              variant="outlined"
              label="Enter Part Name"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
            />
            {isError && (
              <FormHelperText id="component-error-text">
                {(error as any)?.message}
              </FormHelperText>
            )}

            <Button
              onClick={handleCreatePart}
              variant="outlined"
              size="large"
              disabled={partName.trim() === ''}
            >
              Create
            </Button>
          </FormControl>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CreateEditPart;
