import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';


export interface Rejection {
  name: string;
  id?: string;
}

export interface RejectionsState  {
    rejections: Rejection[];
}

const initialState: RejectionsState = {
    rejections: [],
};

export const rejectionsSlice = createSlice({
    name: 'rejections',
    initialState,
    reducers: {
        setRejections: (state, action: PayloadAction<Rejection[]>)=>{
            state.rejections = action.payload;
        },
        addRejection: (state, action: PayloadAction<Rejection>)=>{
            state.rejections.push(action.payload);
        },
        editRejection: (state, action: PayloadAction<Rejection>)=>{
            state.rejections = state.rejections.map((rejection)=>rejection.id === action.payload.id?{...rejection,name: action.payload.name}:rejection)
        },
        removeRejection: (state, action: PayloadAction<string>)=>{
            state.rejections = state.rejections.filter(rejection=>rejection.id !== action.payload);
        },
},
});

// Action creators are generated for each case reducer function
export const {setRejections} =rejectionsSlice.actions;
export default rejectionsSlice.reducer;

