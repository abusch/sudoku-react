import { useSelector, useDispatch } from 'react-redux';
import {RootState} from '../store';
import {verify, restart, generateNew} from '../sudokuSlice';
import { ActionCreators as UndoActionCreators} from 'redux-undo';

const sudokuSelector = (state: RootState) => state.sudoku;

export const Controls = () => {
  const sudoku = useSelector(sudokuSelector);
  const dispatch = useDispatch();

  return <div className="controls">
    <button id="verify" onClick={() => dispatch(verify())}>Verify</button>
    <button id="restart" onClick={() => dispatch(restart())}>Restart</button>
    <button id="new" onClick={() => dispatch(generateNew())}>New</button>
    <button id="undo" onClick={() => dispatch(UndoActionCreators.undo())} disabled={sudoku.past.length === 0}>Undo</button>
    </div>
}
