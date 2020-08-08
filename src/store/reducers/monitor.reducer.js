import { MonitorActions } from '../actions.const';

const cloneDeep = require('lodash/cloneDeep');


class MonitorState {
  labels = [];
  values = [];
}

class InitialState {
  temperature = new MonitorState();
  moisture = new MonitorState();
}

const parseMonitorChange = (record, state, type) => {
  const { label, value } = record;

  const result = cloneDeep(state)[type];

  if (result.labels.length >= 60) {
    result.labels.splice(0, 1);
    result.values.splice(0, 1);
  }
  result.labels.push(label);
  result.values.push(value);

  return result;
};

const parseMonitorFetch = (records, state, type) => {
  if (!records) {
    return state;
  }

  const { labels, values } = records;

  const result = cloneDeep(state)[type];
  result.labels = labels;
  result.values = values;

  return result;
};

const MonitorReducer = (state = new InitialState(), action) => {
  switch (action.type) {
    case MonitorActions.ON_TEMPERATURE_CHANGE: {
      return {
        ...state,
        temperature: parseMonitorChange(action.value, state, 'temperature')
      };
    }

    case MonitorActions.ON_MOISTURE_CHANGE: {
      return {
        ...state,
        moisture: parseMonitorChange(action.value, state, 'moisture')
      };
    }

    // api
    case MonitorActions.SET_TEMPERATURE_SUCCESS: {
      return {
        ...state,
        temperature: parseMonitorFetch(action.value, state, 'temperature')
      };
    }

    case MonitorActions.SET_MOISTURE_SUCCESS: {
      return {
        ...state,
        moisture: parseMonitorFetch(action.value, state, 'moisture')
      };
    }

    default: {
      return state;
    }
  }
};

export default MonitorReducer;
