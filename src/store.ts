import { configureStore } from '@reduxjs/toolkit';
import selectionReducer from './selectionSlice';
import sudokuReducer from './sudokuSlice';

export const store = configureStore({
  reducer: {
    selection: selectionReducer,
    sudoku: sudokuReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
