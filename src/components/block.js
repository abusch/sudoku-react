import { useSelector } from 'react-redux';
import { Cell } from './cell';

export const Block = (props) => {
  const selection = useSelector(state => state.selection);
  const data = useSelector(state => state.sudoku.present);

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
      let selectedClass;
      if (x === column && y === row) {
        selectedClass = "selectedCell";
      } else if (x === column) {
        selectedClass = "selectedColumn";
      } else if (y === row) {
        selectedClass = "selectedRow";
      } else if (blockX === selectedBlockX && blockY === selectedBlockY) {
        selectedClass = "selectedBlock";
      } else {
        selectedClass = "";
      }
      // Generate an appropriate key to make sure a cell is only rerendered when needed:
      const key = x + "," + y + "," + selectedClass;
      cells.push(<Cell key={key} value={data[y * 9 + x]} selectedClass={selectedClass} />);
    }
  }

  return <div className="block">
    {cells}
  </div>
}
