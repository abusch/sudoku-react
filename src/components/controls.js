import { useDispatch } from 'react-redux';
import {verify, restart} from '../sudokuSlice';

export const Controls = (props) => {
  const dispatch = useDispatch();

  return <div className="controls">
    <button id="verify" onClick={() => dispatch(verify())}>Verify</button>
    <button id="restart" onClick={() => dispatch(restart())}>Restart</button>
    </div>
}
