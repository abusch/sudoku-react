import { createSlice } from '@reduxjs/toolkit';

export const selectionSlice = createSlice({
  name: 'selection',
  initialState: {
    row: 0,
    column: 0,
  },
  reducers: {
    moveRight: state => {
      state.column = (state.column === 8) ? 0 : (state.column + 1);
    },
    moveLeft: state => {
      state.column = (state.column === 0) ? 8 : (state.column - 1);
    },
    moveUp: state => {
      state.row = (state.row === 0) ? 8 : (state.row - 1);
    },
    moveDown: state => {
      state.row = (state.row === 8) ? 0 : (state.row + 1);
    },
  }
});

export const { moveRight, moveLeft, moveUp, moveDown } = selectionSlice.actions;

export default selectionSlice.reducer;
