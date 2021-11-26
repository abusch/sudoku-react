import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { moveRight, moveLeft, moveUp, moveDown } from './selectionSlice';
import { setDigit, setPencilMark } from './sudokuSlice';
import { Board } from './components/board';
import { Controls } from './components/controls';
import './App.css';
import { RootState } from './store';

const selectionSelector = (state: RootState) => state.selection;
const App = () => {
  const selection = useSelector(selectionSelector);
  const dispatch = useDispatch();

  const digitKeyToDigit = (code: string) => {
    switch (code) {
      case "Digit1": return 1;
      case "Digit2": return 2;
      case "Digit3": return 3;
      case "Digit4": return 4;
      case "Digit5": return 5;
      case "Digit6": return 6;
      case "Digit7": return 7;
      case "Digit8": return 8;
      case "Digit9": return 9;
      default: return undefined;
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      let x = selection.column;
      let y = selection.row;

      if (event.key === 'j' || event.key === 'ArrowDown') {
        dispatch(moveDown());
      } else if (event.key === 'k' || event.key === 'ArrowUp') {
        dispatch(moveUp());
      } else if (event.key === 'h' || event.key === 'ArrowLeft') {
        dispatch(moveLeft());
      } else if (event.key === 'l' || event.key === 'ArrowRight') {
        dispatch(moveRight());
      } else if (event.key === 'Backspace') {
        const payload = {
          column: x,
          row: y,
          digit: 0,
        };
        dispatch(setDigit(payload));
      } else {
        const digit = digitKeyToDigit(event.code);
        if (digit) {
          const payload = {
            column: x,
            row: y,
            digit: digit,
          };
          if (event.shiftKey) {
            dispatch(setPencilMark(payload));
          } else {
            dispatch(setDigit(payload));
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch, selection]);


  return (
    <div className="content">
      <h1>SUDOKU</h1>
      <Board />
      <Controls />
      <footer>
        <div>&copy; Copyright 2021, Antoine Busch</div>
        <div>Colours by <a href="https://www.nordtheme.com/">Nord Theme</a></div>
      </footer>
    </div>
  );
}

export default App;
