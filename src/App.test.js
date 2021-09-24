import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import { solveSudoku } from './sudoku';

test('renders Sudoku', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>);
  const title = screen.getByText(/SUDOKU/i);
  expect(title).toBeInTheDocument();
});

test('solves Sudoku', () => {
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

  let result = solveSudoku(sampleSudoku);
  expect(result).toBeTruthy();

  console.log(sampleSudoku);
})
