import { createSlice } from '@reduxjs/toolkit';
import { checkCellObjectValid } from './sudoku';

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
  valid: true,
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
        cell.valid = checkCellObjectValid(state, row, column, digit);
        cell.value = digit;
        cell.pencilMarks.clear();
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
          cell.value = 0;
        } 
      }
    }
  }
});

export const {setDigit, setPencilMark} = sudokuSlice.actions;
export default sudokuSlice.reducer;
