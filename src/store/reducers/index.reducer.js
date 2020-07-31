import MonitorReducer from './monitor.reducer.js';
import SignalReducer from './signal.reducer';

import { combineReducers } from 'redux';

const allReducers = combineReducers({
  monitor: MonitorReducer,
  signal: SignalReducer
});

export default allReducers;
