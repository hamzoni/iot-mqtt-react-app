import ReduxActions from '../actions.const';

class InitialState {
  labels = [];
  values = [];
}

const dataReducer = (state = new InitialState(), action) => {
  switch (action.type) {

    case ReduxActions.UPDATE_DATA:
      const { label, value } = action.value;

      if (state.labels.length >= 60) {
        state.labels.splice(0, 1);
        state.values.splice(0, 1);
      }
      state.labels.push(label);
      state.values.push(value);

      return JSON.parse(JSON.stringify(state));

    case ReduxActions.SET_DATA:
      const { labels, values } = action.value;
      state.labels = labels;
      state.values = values;

      return JSON.parse(JSON.stringify(state));

    default:
      return state;
  }
};

export default dataReducer;
