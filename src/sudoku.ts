export interface CellData {
  value: number,
  locked: boolean,
  valid: boolean,
  pencilMarks: Array<number>,
}

// Generate a sudoku to be solve, i.e. with a number of empty cells, and with
// the guarantee that there is a unique solution.
function generateSudoku(): number[] {
  let sudoku = generateValidSudoku();

  let removed_digits = 0;

  while (removed_digits <= 50) {
    let idx = Math.floor(Math.random() * sudoku.length);
    if (sudoku[idx] === 0) {
      continue;
    }
    let temp = sudoku[idx];
    sudoku[idx] = 0;
    if (countSolutions([...sudoku]) === 1) {
      removed_digits += 1;
    } else {
      sudoku[idx] = temp;
    }
  }

  return sudoku;
}

// Generate a fully solved sudoku
function generateValidSudoku(): number[] {
  let sudoku: number[] = Array<number>(81);
  sudoku.fill(0);

  if (generateSudokuInternal(sudoku)) {
    return sudoku;
  }

  return [];
}

function generateSudokuInternal(cells: number[]) {
  let cell_idx = findEmptyCell(cells);
  
  if (cell_idx === -1) {
    return true;
  }

  let digits = generateRandomPermutation();
  for (const digit of digits) {
    if (checkCellValid(cells, cell_idx, digit)) {
      cells[cell_idx] = digit;
      if (generateSudokuInternal(cells)) {
        return true;
      } else {
        cells[cell_idx] = 0;
      }
    }
  }

  return false;
}

function countSolutions(cells: Array<number>): number {
  let cell_idx = findEmptyCell(cells);

  if (cell_idx === -1) {
    return 1;
  }

  let num_solutions = 0;
  for (let i = 1; i <= 9; i++) {
    if (checkCellValid(cells, cell_idx, i)) {
      cells[cell_idx] = i;
      num_solutions += countSolutions(cells);
      cells[cell_idx] = 0;
    }
  }

  return num_solutions;
}

// Recursively attempts to solve this sudoku
function solveSudoku(cells: Array<number>): boolean {
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

// Check if placing the given digit in the given cell index is a valid move
function checkCellValid(cells: Array<number>, cell_idx: number, digit: number): boolean {
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

function checkCellObjectValid(cells: Array<CellData>, row: number, col: number, digit: number): boolean {
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
function removePencilMarks(cells: Array<CellData>, row: number, col: number, digit: number) {

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
      const i = sameCol.pencilMarks.indexOf(digit);
      if (i !== -1) {
        sameCol.pencilMarks.splice(i, 1);
      }
    }
    if (sameRowIdx !== cellIdx) {
      const i = sameRow.pencilMarks.indexOf(digit);
      if (i !== -1) {
        sameRow.pencilMarks.splice(i, 1);
      }
    }
    if (sameBlockIdx !== cellIdx) {
      const i = sameBlock.pencilMarks.indexOf(digit);
      if (i !== -1) {
        sameBlock.pencilMarks.splice(i, 1);
      }
    }
  }
}

// Finds the first (starting from the top-right and working row by row) cell that is empty
function findEmptyCell(cells: Array<number>): number {
  for (let i = 0; i < 81; i++) {
    if (cells[i] === 0) {
      return i;
    }
  }

  return -1;
}

// Generate a random permutation of the digits from 1 to 9
function generateRandomPermutation() {
  let digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i =0; i < 9; i++) {
    let idx = i + Math.floor(Math.random() * (9 - i));
    let t = digits[i];
    digits[i] = digits[idx];
    digits[idx] = t;
  }

  return digits;
}

export {solveSudoku, checkCellObjectValid, removePencilMarks, countSolutions, generateSudoku, generateRandomPermutation};
