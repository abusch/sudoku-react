import { createSlice } from '@reduxjs/toolkit';

const initialData = [
  0, 0, 1, 2, 0, 3, 4, 0, 0,
  0, 0, 0, 6, 0, 7, 0, 0, 0,
  5, 0, 0, 0, 0, 0, 0, 0, 3,
  3, 7, 0, 0, 0, 0, 0, 8, 1,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  6, 2, 0, 0, 0, 0, 0, 3, 7,
  1, 0, 0, 0, 0, 0, 0, 0, 8,
  0, 0, 0, 8, 0, 5, 0, 0, 0,
  0, 0, 6, 4, 0, 2, 5, 0, 0];

const digitToCell = (digit) => ({
  value: digit,
  locked: (digit !== 0),
  pencilMarks: new Set(),
});

export const sudokuSlice = createSlice({
  name: 'sudoku',
  initialState: initialData.map(digitToCell),
  reducers: {
    setDigit: (state, action) => {
      const { row, column, digit } = action.payload;
      const cell = state[row * 9 + column];
      if (!cell.locked) {
        cell.value = digit;
      }
    },
    setPencilMark: (state, action) => {
      const { row, column, digit } = action.payload;
      const cell = state[row * 9 + column];
      if (!cell.locked) {
        if (cell.pencilMarks.has( digit )) {
          cell.pencilMarks.delete( digit );
        } else {
          cell.pencilMarks.add( digit );
        } 
      }
    }
  }
});

export const {setDigit, setPencilMark} = sudokuSlice.actions;
export default sudokuSlice.reducer;
