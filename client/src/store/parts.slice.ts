import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Part {
  name: string;
  id?: string;
}

export interface PartsState {
  parts: Part[];
}

const initialState: PartsState = {
  parts: [],
};

export const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    setParts: (state, action: PayloadAction<Part[]>) => {
      state.parts = action.payload;
    },
    addPart: (state, action: PayloadAction<Part>) => {
      state.parts.push(action.payload);
    },
    removePart: (state, action: PayloadAction<string>) => {
      state.parts = state.parts.filter(part => part.name !== action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setParts } = partsSlice.actions;

export default partsSlice.reducer;
