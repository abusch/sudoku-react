import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { moveRight, moveLeft, moveUp, moveDown } from './selectionSlice';
import { setDigit, setPencilMark } from './sudokuSlice';
import { Board } from './components/board';
import './App.css';

const App = () => {
  const selection = useSelector(state => state.selection);
  const dispatch = useDispatch();

  const digitKeyToDigit = (code) => {
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
    const handleKeyDown = (event) => {
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
      } else if (digitKeyToDigit(event.code)) {
        const payload = {
          column: x,
          row: y,
          digit: digitKeyToDigit(event.code),
        };
        if (event.shiftKey) {
          dispatch(setPencilMark(payload));
        } else {
          dispatch(setDigit(payload));
        }
      } else if (event.key === 'Backspace') {
        const payload = {
          column: x,
          row: y,
          digit: 0,
        };
        dispatch(setDigit(payload));
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
      <footer>
        <div>&copy; Copyright 2021, Antoine Busch</div>
        <div>Colours by <a href="https://www.nordtheme.com/">Nord Theme</a></div>
      </footer>
    </div>
  );
}

export default App;
