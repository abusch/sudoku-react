import './App.css';
import React, { useState, useEffect } from 'react';

export const Cell = (props) => {
  const value = (props.value.value === 0) ? " " : (props.value.value);
  const locked = (props.value.locked) ? "locked " : " ";
  return <div className={"cell " + locked + props.selection}>
    {value}
  </div>;
}

export const Board = (props) => {
  const renderBlock = (blockX, blockY) => {
    const cells = Array(9);
    const data = props.cellData;
    const selectedBlockX = Math.floor(props.selectedColumn / 3);
    const selectedBlockY = Math.floor(props.selectedRow / 3);

    for (let j = 0; j < 3; j++) {
      const y = blockY * 3 + j;
      for (let i = 0; i < 3; i++) {
        const x = blockX * 3 + i;
        let selection;
        if (x === props.selectedColumn && y === props.selectedRow) {
          selection = "selectedCell";
        } else if (x === props.selectedColumn) {
          selection = "selectedColumn";
        } else if (y === props.selectedRow) {
          selection = "selectedRow";
        } else if (blockX === selectedBlockX && blockY === selectedBlockY) {
          selection = "selectedBlock";
        } else {
          selection = "";
        }
        cells.push(<Cell key={x + "," + y + "," + selection} value={data[y * 9 + x]} selection={selection} />);
      }
    }
    return <div className="block">
      {cells}
    </div>
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
  const data = [
    0, 0, 1, 2, 0, 3, 4, 0, 0,
    0, 0, 0, 6, 0, 7, 0, 0, 0,
    5, 0, 0, 0, 0, 0, 0, 0, 3,
    3, 7, 0, 0, 0, 0, 0, 8, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    6, 2, 0, 0, 0, 0, 0, 3, 7,
    1, 0, 0, 0, 0, 0, 0, 0, 8,
    0, 0, 0, 8, 0, 5, 0, 0, 0,
    0, 0, 6, 4, 0, 2, 5, 0, 0];
  const [boardData, setBoardData] = useState(data.map(v => {
    return { value: v, locked: (v !== 0) };
  }));
  const [selection, setSelection] = useState({
    row: 1,
    column: 1
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      let x = selection.column;
      let y = selection.row;
      console.log("In handleKeyDown: event = " + event.key);
      console.log("state = " + boardData);
      console.log("current selected: " + x + ", " + y);

      if (event.key === 'j' || event.key === 'ArrowDown') {
        if (y === 8) {
          y = 0;
        } else {
          y = y + 1;
        }
      } else if (event.key === 'k' || event.key === 'ArrowUp') {
        if (y === 0) {
          y = 8;
        } else {
          y = y - 1;
        }
      } else if (event.key === 'h' || event.key === 'ArrowLeft') {
        if (x === 0) {
          x = 8;
        } else {
          x = x - 1;
        }
      } else if (event.key === 'l' || event.key === 'ArrowRight') {
        if (x === 8) {
          x = 0;
        } else {
          x = x + 1;
        }
      }
      setSelection({ column: x, row: y });

      const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
      if (digits.includes(event.key)) {
        setBoardData((prevState) => {
          const data = prevState.slice();
          const currentCell = data[y * 9 + x];
          if (!currentCell.locked) {
            currentCell.value = parseInt(event.key);
          }
          return data;
        })

      }
      console.log("After update selected: " + x + ", " + y);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [boardData, selection]);


  return (
    <div className="content">
      <h1>SUDOKU</h1>
      <Board
        cellData={boardData}
        selectedRow={selection.row}
        selectedColumn={selection.column} />
      <footer>&copy; Copyright 2021, Antoine Busch</footer>
    </div>
  );
}

export default App;
