import { configureStore } from '@reduxjs/toolkit';
import selectionReducer from './selectionSlice';
import sudokuReducer from './sudokuSlice';

export default configureStore({
  reducer: {
    selection: selectionReducer,
    sudoku: sudokuReducer,
  }
})
