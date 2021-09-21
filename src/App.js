import './App.css';
import React, { useState, useEffect } from 'react';

export const Cell = (props) => {
  const value = (props.value.value === 0) ? " " : (props.value.value);
  const locked = (props.value.locked) ? "locked " : " ";
  return <div className={"cell " + locked + props.selection}>
    {value}
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
      const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
      let x = selection.column;
      let y = selection.row;
      console.log("In handleKeyDown: event = " + event.key);
      console.log("state = " + boardData);
      console.log("current selected: " + x + ", " + y);

      if (event.key === 'j' || event.key === 'ArrowDown') {
        y = (y === 8) ? 0 : y + 1;
        setSelection({ column: x, row: y });
      } else if (event.key === 'k' || event.key === 'ArrowUp') {
        y = (y === 0) ? 8 : y - 1;
        setSelection({ column: x, row: y });
      } else if (event.key === 'h' || event.key === 'ArrowLeft') {
        x = (x === 0) ? 8 : x - 1;
        setSelection({ column: x, row: y });
      } else if (event.key === 'l' || event.key === 'ArrowRight') {
        x = (x === 8) ? 0 : x + 1;
        setSelection({ column: x, row: y });
      } else if (digits.includes(event.key)) {
        setBoardData((prevState) => {
          const data = prevState.slice();
          const currentCell = data[y * 9 + x];
          if (!currentCell.locked) {
            currentCell.value = parseInt(event.key);
          }
          return data;
        })
      } else if (event.key === 'Backspace') {
        setBoardData((prevState) => {
          const data = prevState.slice();
          const currentCell = data[y * 9 + x];
          if (!currentCell.locked) {
            currentCell.value = 0;
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
  }, [boardData, selection]);


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

export default App;
