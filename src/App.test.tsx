import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';
import { countSolutions, generateRandomPermutation, generateSudoku, solveSudoku } from './sudoku';

const sampleSudoku = [
  0, 0, 1, 2, 0, 3, 4, 0, 0,
  0, 0, 0, 6, 0, 7, 0, 0, 0,
  5, 0, 0, 0, 0, 0, 0, 0, 3,
  3, 7, 0, 0, 0, 0, 0, 8, 1,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  6, 2, 0, 0, 0, 0, 0, 3, 7,
  1, 0, 0, 0, 0, 0, 0, 0, 8,
  0, 0, 0, 8, 0, 5, 0, 0, 0,
  0, 0, 6, 4, 0, 2, 5, 0, 0];

test('renders Sudoku', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>);
  const title = screen.getByText(/SUDOKU/i);
  expect(title).toBeInTheDocument();
});

test('solves Sudoku', () => {
  let sudoku = [...sampleSudoku];
  let result = solveSudoku(sudoku);
  expect(result).toBeTruthy();

  console.log(sudoku);
})

test('unique solution', () => {
  let count = countSolutions([...sampleSudoku]);
  expect(count).toBe(1);
})

test('generate random permutation', () => {
  let digits = generateRandomPermutation();
  expect(digits.length).toBe(9);

  console.log(digits);
})

test('generate a sudoku', () => {
  let sudoku = generateSudoku();
  expect(sudoku.length).toBe(81);

  console.log(sudoku);
})
