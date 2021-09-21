import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { moveRight, moveLeft, moveUp, moveDown } from './selectionSlice';
import { setDigit, setPencilMark } from './sudokuSlice';
import './App.css';

export const Cell = (props) => {
  const classes = ["cell", props.selection];
  const pencilMarks = Array.from(props.value.pencilMarks).sort().join(' ');

  if (props.value.locked) {
    classes.push("locked");
  }

  let displayValue;
  if (props.value.value === 0) {
    displayValue = pencilMarks;
    classes.push("pencilMark");
  } else {
    displayValue = props.value.value;
  }

  return <div className={classes.join(' ')}>
    {displayValue}
  </div>;
}

const Block = (props) => {
  const selection = useSelector(state => state.selection);
  const data = useSelector(state => state.sudoku);

  const blockX = props.x;
  const blockY = props.y;

  const cells = [];
  const { row, column } = selection;
  const selectedBlockX = Math.floor(column / 3);
  const selectedBlockY = Math.floor(row / 3);

  for (let j = 0; j < 3; j++) {
    const y = blockY * 3 + j;
    for (let i = 0; i < 3; i++) {
      const x = blockX * 3 + i;
      let selection;
      if (x === column && y === row) {
        selection = "selectedCell";
      } else if (x === column) {
        selection = "selectedColumn";
      } else if (y === row) {
        selection = "selectedRow";
      } else if (blockX === selectedBlockX && blockY === selectedBlockY) {
        selection = "selectedBlock";
      } else {
        selection = "";
      }
      // Generate an appropriate key to make sure a cell is only rerendered when needed:
      const key = x + "," + y + "," + selection;
      cells.push(<Cell key={key} value={data[y * 9 + x]} selection={selection} />);
    }
  }

  return <div className="block">
    {cells}
  </div>
}

export const Board = (props) => {
  const renderBlock = (blockX, blockY) => {
    return <Block x={blockX} y={blockY} cellData={props.cellData} selection={props.selection} />;
  };

  return <div className="board">
    {renderBlock(0, 0)}
    {renderBlock(1, 0)}
    {renderBlock(2, 0)}
    {renderBlock(0, 1)}
    {renderBlock(1, 1)}
    {renderBlock(2, 1)}
    {renderBlock(0, 2)}
    {renderBlock(1, 2)}
    {renderBlock(2, 2)}
  </div>;
}

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
      <footer>&copy; Copyright 2021, Antoine Busch</footer>
    </div>
  );
}

export default App;
