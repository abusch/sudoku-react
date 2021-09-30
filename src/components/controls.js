import { useSelector, useDispatch } from 'react-redux';
import {verify, restart} from '../sudokuSlice';
import { ActionCreators as UndoActionCreators} from 'redux-undo';

export const Controls = (props) => {
  const sudoku = useSelector(state => state.sudoku);
  const dispatch = useDispatch();

  return <div className="controls">
    <button id="verify" onClick={() => dispatch(verify())}>Verify</button>
    <button id="restart" onClick={() => dispatch(restart())}>Restart</button>
    <button id="undo" onClick={() => dispatch(UndoActionCreators.undo())} disabled={sudoku.past.length === 0}>Undo</button>
    </div>
}
