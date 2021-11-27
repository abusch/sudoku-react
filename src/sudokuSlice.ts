import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CellData, checkCellObjectValid, generateSudoku, removePencilMarks } from './sudoku';
import undoable from 'redux-undo';

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

const digitToCell = (digit: number) => ({
  value: digit,
  locked: (digit !== 0),
  valid: true,
  pencilMarks: [],
});

const initialState: Array<CellData> = initialData.map(digitToCell);

export interface SudokuPayload {
  row: number,
  column: number,
  digit: number,
}

export const sudokuSlice = createSlice({
  name: 'sudoku',
  initialState: initialState,
  reducers: {
    setDigit: (state, action: PayloadAction<SudokuPayload>) => {
      const { row, column, digit } = action.payload;
      const cell = state[row * 9 + column];
      if (!cell.locked) {
        cell.value = digit;
        cell.pencilMarks = [];
        removePencilMarks(state, row, column, digit);
      }
    },
    setPencilMark: (state, action: PayloadAction<SudokuPayload>) => {
      const { row, column, digit } = action.payload;
      const cell = state[row * 9 + column];
      if (!cell.locked) {
        const i = cell.pencilMarks.indexOf(digit);
        if (i !== -1) {
          cell.pencilMarks.splice(i, 1);
        } else {
          cell.pencilMarks.push( digit );
          cell.value = 0;
        } 
      }
    },
    verify: (state) => {
      state.forEach((cell, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        if (!cell.locked) {
          cell.valid = checkCellObjectValid(state, row, col, cell.value);
        }
      });
    },
    restart: (state) => {
      state.forEach((cell) => {
        if (!cell.locked) {
          cell.value = 0;
          cell.pencilMarks = [];
          cell.valid = true;
        }
      });
    },
    generateNew: (state) => {
      const sudoku = generateSudoku();
      state.splice(0, 81, ...sudoku.map(digitToCell));
    }
  }
});

export const {setDigit, setPencilMark, verify, restart, generateNew} = sudokuSlice.actions;
export default undoable(sudokuSlice.reducer);
