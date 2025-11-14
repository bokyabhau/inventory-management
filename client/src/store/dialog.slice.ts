import { createSelector, createSlice } from "@reduxjs/toolkit";

type DialogState = {
  confirmation: boolean
};

const initialState: DialogState = {
  confirmation: false
};

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    openConfirmationDialog(state) {
      state.confirmation = true;;
    },
    closeConfirmationDialog(state) {
      state.confirmation = false;
    },
  },
});

export const { openConfirmationDialog, closeConfirmationDialog } = dialogSlice.actions;
export default dialogSlice.reducer;

export const selectConfirmationDialogState = createSelector(
  (state: { dialog: DialogState }) => state.dialog,
  (dialog) => dialog.confirmation
);