import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { closeConfirmationDialog, selectConfirmationDialogState } from "../../store/dialog.slice";
import { useDispatch, useSelector } from "react-redux";
import type { FC } from "react";

type ConfirmationDialogProps = {
  onConfirm: () => void;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const ConfirmationDialog: FC<ConfirmationDialogProps> = ({ onConfirm }) => {

  const dialogState = useSelector(selectConfirmationDialogState);
  const dispatch = useDispatch();

  const closeDialog = () => {
    dispatch(closeConfirmationDialog());
  }

  const handleConfirm = () => {
    onConfirm();
    closeDialog();
  }

  return <Modal
    open={dialogState}
    onClose={closeDialog}
    aria-labelledby="parent-modal-title"
    aria-describedby="parent-modal-description"
  >
    <Box sx={{ ...style, width: 400 }}>
      <h2 id="parent-modal-title">Confirm Delete</h2>
      <p id="parent-modal-description">
        Are you sure you want to delete this item?
      </p>
      <Box>
        <Button variant="contained" color="error" onClick={handleConfirm}>Confirm</Button>
        <Button variant="contained" color="info" onClick={closeDialog}>Cancel</Button>
      </Box>
    </Box>
  </Modal>;
}

export default ConfirmationDialog;