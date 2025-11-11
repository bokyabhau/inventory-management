import { List, ListItem, ListItemText, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const SideNav: React.FC = () => (
  <Paper style={{ height: '100%' }}>
    <List>
      <ListItem component={Link} to="/data-entry">
        <ListItemText primary="Data Entry" />
      </ListItem>
      <ListItem component={Link} to="/parts">
        <ListItemText primary="Parts" />
      </ListItem>
      <ListItem component={Link} to="/rejections">
        <ListItemText primary="Rejections" />
      </ListItem>
    </List>
  </Paper>
);

export default SideNav;
