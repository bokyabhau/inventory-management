import { List } from '@mui/material';
import Part from './Part';
import { useParts } from '../../queryClient/hooks';

const PartList = () => {
  const { data: parts } = useParts();
  return (
    <List>
      {parts?.length && parts.map(part => <Part key={part.id} name={part.name} />)}
    </List>
  );
};

export default PartList;
