const dataReducer = (state = {}, action) => {
  switch (action.name) {
    case 'UPDATE_DATA':
      state = action.data;
      return state;
    case 'SET_DATA':
      state = action.data;
      return state;
    default:
      return state;
  }
};

export default dataReducer;
