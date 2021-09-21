import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { moveRight, moveLeft, moveUp, moveDown } from './selectionSlice';
import './App.css';

export const Cell = (props) => {
  const classes = ["cell", props.selection];
  const value = (props.value.value === 0) ? " " : (props.value.value);
  const pencilMarks = props.value.pencilMarks.filter(v => v !== undefined).join(' ');
  const displayValue = (pencilMarks !== "") ? pencilMarks : value;

  if (props.value.locked) {
    classes.push("locked");
  }
  if (pencilMarks !== "") {
    classes.push("pencilMark");
  }

  // console.log(`value: ${value}, pencilMarks: ${pencilMarks}, displayValue: ${displayValue}`);

  return <div className={classes.join(' ')}>
    {displayValue}
  </div>;
}

const Block = (props) => {
  const blockX = props.x;
  const blockY = props.y;

  const cells = [];
  const data = props.cellData;
  const { row, column } = props.selection;
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
  const sudoku = [
    0, 0, 1, 2, 0, 3, 4, 0, 0,
    0, 0, 0, 6, 0, 7, 0, 0, 0,
    5, 0, 0, 0, 0, 0, 0, 0, 3,
    3, 7, 0, 0, 0, 0, 0, 8, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    6, 2, 0, 0, 0, 0, 0, 3, 7,
    1, 0, 0, 0, 0, 0, 0, 0, 8,
    0, 0, 0, 8, 0, 5, 0, 0, 0,
    0, 0, 6, 4, 0, 2, 5, 0, 0];
  const initialData = sudoku.map(v => {
    return { value: v, locked: (v !== 0), pencilMarks: Array(9) };
  });
  const [boardData, setBoardData] = useState(initialData);
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
      // console.log("In handleKeyDown: event = " + event.key);
      // console.log("state = " + boardData);
      // console.log("current selected: " + x + ", " + y);

      if (event.key === 'j' || event.key === 'ArrowDown') {
        dispatch(moveDown());
      } else if (event.key === 'k' || event.key === 'ArrowUp') {
        dispatch(moveUp());
      } else if (event.key === 'h' || event.key === 'ArrowLeft') {
        dispatch(moveLeft());
      } else if (event.key === 'l' || event.key === 'ArrowRight') {
        dispatch(moveRight());
      } else if (digitKeyToDigit(event.code)) {
        setBoardData((prevState) => {
          const data = prevState.slice();
          const cellOffset = y * 9 + x;
          const currentCell = data[cellOffset];
          const digit = digitKeyToDigit(event.code);
          // Don't touch locked cells
          if (!currentCell.locked) {
            // console.log(`cell before: ${JSON.stringify(data)}`);
            if (event.shiftKey) {
              const pencilMarks = currentCell.pencilMarks.slice();
              // console.log(`Got a pencil mark: ${digit}`);
              // pencil mark
              if (pencilMarks[digit]) {
                pencilMarks[digit] = undefined;
              } else {
                pencilMarks[digit] = digit;
              }
              data[cellOffset] = { ...currentCell, pencilMarks: pencilMarks };
            } else {
              // Regular digit
              data[cellOffset] = { ...currentCell, value: digit };
            }
            // console.log(`cell after: ${JSON.stringify(data)}`);
          }
          return data;
        })
      } else if (event.key === 'Backspace') {
        setBoardData((prevState) => {
          const data = prevState.slice();
          const currentCell = data[y * 9 + x];
          if (!currentCell.locked) {
            data[y * 9 + x] = { ...currentCell, value: 0 };
          }
          return data;
        })
      }
      // console.log("After update selected: " + x + ", " + y);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [boardData, dispatch, selection]);


  return (
    <div className="content">
      <h1>SUDOKU</h1>
      <Board
        cellData={boardData}
        selection={selection}
      />
      <footer>&copy; Copyright 2021, Antoine Busch</footer>
    </div>
  );
}

/* function* range(start, stop) {
  for(let i = start; i < stop; i++) {
    yield i;
  }
} */

export default App;
