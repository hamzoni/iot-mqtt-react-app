import ReduxActions from '../actions.const';

class InitialState {
  labels = [];
  values = [];
}

const dataReducer = (state = new InitialState(), action) => {
  switch (action.name) {

    case ReduxActions.UPDATE_DATA:
      const { label, value } = action.value;
      state.labels.splice(0, 1);
      state.values.splice(0, 1);
      state.labels.push(label);
      state.values.push(value);
      return state;

    case ReduxActions.SET_DATA:
      const { labels, values } = action.value;
      state.labels = labels;
      state.values = values;
      return state;

    default:
      return state;
  }
};

export default dataReducer;
