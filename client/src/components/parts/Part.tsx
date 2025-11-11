import {
  Button,
  ListItem,
  ListItemText,
} from '@mui/material';
import type React from 'react';
import { useState } from 'react';

const Part: React.FC<{ name: string }> = ({ name }) => {
  const [isEdit, setIsEdit] = useState(false);
  return (
    <ListItem
      secondaryAction={[
        <Button color="primary" key={`${name}-edit`} onClick={() => setIsEdit(true)}>Edit</Button>,
        <Button color="error" key={`${name}-delete`}>Delete</Button>,
      ]}
    >
      {isEdit && <input type="text" defaultValue={name} />}
      {!isEdit && <ListItemText primary={name} />}
    </ListItem>
  );
};

export default Part;
