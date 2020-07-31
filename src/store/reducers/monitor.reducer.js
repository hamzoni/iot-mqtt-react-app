import { MonitorActions } from '../actions.const';

const cloneDeep = require('lodash/cloneDeep');


class MonitorState {
  labels = [];
  values = [];
}

class InitialState {
  temperature = new MonitorState();
}

const MonitorReducer = (state = new InitialState(), action) => {
  switch (action.type) {
    case MonitorActions.ON_TEMPERATURE_CHANGE:
      const { label, value } = action.value;

      const t1 = cloneDeep(state).temperature;

      if (t1.labels.length >= 60) {
        t1.labels.splice(0, 1);
        t1.values.splice(0, 1);
      }
      t1.labels.push(label);
      t1.values.push(value);

      return {
        ...state,
        temperature: t1
      };

    // api
    case MonitorActions.SET_TEMPERATURE_SUCCESS:

      if (!action.value) {
        return state;
      }

      const { labels, values } = action.value;

      const t2 = cloneDeep(state).temperature;
      t2.labels = labels;
      t2.values = values;

      return {
        ...state,
        temperature: t2
      };

    default:
      return state;
  }
};

export default MonitorReducer;
