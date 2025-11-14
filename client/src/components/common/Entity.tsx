import type { Entity } from "./common.types";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useState } from "react";
import type { SxProps } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { openConfirmationDialog } from "../../store/dialog.slice";
import ConfirmationDialog from "./ConfirmationDialog";

const buttonStyle: SxProps = {
  margin: '0 5px'
}

const textContainerStyle: SxProps = {
  flex: '1',
}

const buttonsContainerStyle: SxProps = {
  display: 'flex',
  flexDirection: 'row',
}

const containerStyle: SxProps = { margin: '5px 0' }

type EntityProps = {
  entity: Entity;
  onEdit: (entity: Entity) => void;
  onDelete: (entity: Entity) => void;
}

const EntityList: React.FC<EntityProps> = ({ entity, onDelete, onEdit }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(entity.name);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEdit = () => {
    onEdit({ ...entity, name });
    setEditing(false);

  };

  const handleDelete = () => {
    dispatch(openConfirmationDialog());
  };

  const confirmDelete = () => {
    onDelete(entity);
  }

  return <Grid container columns={2} sx={containerStyle}>
    <Box sx={textContainerStyle}>
      {editing && <FormControl fullWidth>
        <TextField value={name} onChange={handleNameChange} />
      </FormControl>}
      {!editing && <ListItemText primary={entity.name} />}
    </Box>
    <Box sx={buttonsContainerStyle}>
      <FormControl sx={buttonsContainerStyle}>
        {!editing && <Button sx={buttonStyle} variant="contained" color="primary" onClick={() => setEditing(true)}>
          Edit
        </Button>}
        {!editing && <Button sx={buttonStyle} variant="contained" color="secondary" onClick={handleDelete}>Delete</Button>}
        {editing && <Button sx={buttonStyle} variant="contained" color="primary" onClick={handleEdit} disabled={!name || name === entity.name}>Save</Button>}
        {editing && <Button sx={buttonStyle} variant="contained" color="secondary" onClick={() => setEditing(false)}>Cancel</Button>}
      </FormControl>
    </Box>
    <ConfirmationDialog onConfirm={confirmDelete} />
  </Grid>
};

export default EntityList;