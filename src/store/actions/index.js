import ReduxActions from '../actions.const';

export const setData = value => {
  return {
    type: ReduxActions.SET_DATA,
    value
  };
};

export const updateData = value => {
  return {
    type: ReduxActions.UPDATE_DATA,
    value
  };
};
