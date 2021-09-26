// Recursively attempts to solve this sudoku
function solveSudoku(cells) {
  let cell_idx = findEmptyCell(cells);
  if (cell_idx === -1) {
    // No more empty cells, we've solved the sudoku
    return true;
  }

  for (let i = 1; i <= 9; i++) {
    if (checkCellValid(cells, cell_idx, i)) {
      cells[cell_idx] = i;
      if (solveSudoku(cells)) {
        return true;
      } else {
        // That digit didn't work out, try the next one
        cells[cell_idx] = 0;
      }
    }
  }

  // If we tried all the digits for that cell and couldn't solve the sudoku,
  // then we've failed
  return false;
}

function checkCellValid(cells, cell_idx, digit) {
  const row = Math.floor(cell_idx / 9);
  const col = cell_idx % 9;
  // top-left coordinates of the 3x3 block that contains the cell
  const block_row = Math.floor(row / 3) * 3;
  const block_col = Math.floor(col / 3) * 3;

  for (let i = 0; i < 9; i++) {
    const row_offset = Math.floor(i / 3);
    const column_offset = i % 3;
    if (cells[row * 9 + i] === digit // check column
      || cells[i * 9 + col] === digit  // check row
      || cells[(block_row + row_offset) * 9 + (block_col + column_offset)] === digit // check block
    ) {
      return false;
    }
  }

  return true;
}

function checkCellObjectValid(cells, row, col, digit) {
  if (digit === 0) {
    return true;
  }

  // top-left coordinates of the 3x3 block that contains the cell
  const cellIdx = row * 9 + col;
  const block_row = Math.floor(row / 3) * 3;
  const block_col = Math.floor(col / 3) * 3;

  for (let i = 0; i < 9; i++) {
    const row_offset = Math.floor(i / 3);
    const column_offset = i % 3;
    const sameColIdx = row * 9 + i;
    const sameRowIdx = i * 9 + col;
    const sameBlockIdx = (block_row + row_offset) * 9 + (block_col + column_offset);

    const sameCol = cells[sameColIdx].value;
    const sameRow = cells[sameRowIdx].value;
    const sameBlock = cells[sameBlockIdx].value;

    // Make sure we don't validate the current cell with itself
    const invalidInCol = (sameColIdx === cellIdx) ? false : (sameCol === digit);
    const invalidInRow = (sameRowIdx === cellIdx) ? false : (sameRow === digit);
    const invalidInBlock = (sameBlockIdx === cellIdx) ? false : (sameBlock === digit);

    if (invalidInCol || invalidInRow || invalidInBlock) {
      return false;
    }
  }

  return true;
}

// Remove the pencil marks matching the given digit in the same row/column/block as the
// given selection.
function removePencilMarks(cells, row, col, digit) {

  // top-left coordinates of the 3x3 block that contains the cell
  const cellIdx = row * 9 + col;
  const block_row = Math.floor(row / 3) * 3;
  const block_col = Math.floor(col / 3) * 3;

  for (let i = 0; i < 9; i++) {
    const row_offset = Math.floor(i / 3);
    const column_offset = i % 3;
    const sameColIdx = row * 9 + i;
    const sameRowIdx = i * 9 + col;
    const sameBlockIdx = (block_row + row_offset) * 9 + (block_col + column_offset);

    const sameCol = cells[sameColIdx];
    const sameRow = cells[sameRowIdx];
    const sameBlock = cells[sameBlockIdx];

    if (sameColIdx !== cellIdx) {
      sameCol.pencilMarks.delete(digit);
    }
    if (sameRowIdx !== cellIdx) {
      sameRow.pencilMarks.delete(digit);
    }
    if (sameBlockIdx !== cellIdx) {
      sameBlock.pencilMarks.delete(digit);
    }
  }
}

function findEmptyCell(cells) {
  for (let i = 0; i < 81; i++) {
    if (cells[i] === 0) {
      return i;
    }
  }

  return -1;
}

export {solveSudoku, checkCellObjectValid, removePencilMarks};
