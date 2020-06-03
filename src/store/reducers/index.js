import dataReducer from './data.reducer.js';

import { combineReducers } from 'redux';

const allReducers = combineReducers({
  data: dataReducer
});

export default allReducers;
