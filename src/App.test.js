import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';

test('renders Sudoku', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>);
  const title = screen.getByText(/SUDOKU/i);
  expect(title).toBeInTheDocument();
});
