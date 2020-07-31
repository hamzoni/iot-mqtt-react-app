import { PinControlActions, PinRegistryActions } from '../actions.const';
import { cloneDeep } from 'lodash';


class InitialState {
  pins: [];
}

const SignalReducer = (state = new InitialState(), action) => {
  switch (action.type) {
    
    // case PinRegistryActions.REGISTER:
    //   console.log(action);
    //
    //   return {
    //     ...state,
    //   };

    case PinRegistryActions.LIST_ALL_SUCCESS:
      const results = {};
    
      for (const item of action.value.results) {
        if (!item.board_name) {
          item.board_name = 'Unknown'
        }

        if (!results[item.board_name]) {
          results[item.board_name] = [];
        }
        results[item.board_name].push(item);
      }

      return {
        ...state,
        pins: results,
      };

    case PinControlActions.TURN_ON:
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

    case PinControlActions.TURN_OFF:
      const { labels, values } = action.value;

      const t2 = cloneDeep(state).temperature;
      t2.labels = labels;
      t2.values = values;

      return {
        ...state,
        temperature: t2
      };

    case PinControlActions.SET_VALUE:
      const t3 = cloneDeep(state).temperature;
      t3.labels = action.value.labels;
      t3.values = action.value.values;

      return {
        ...state,
        temperature: t3
      };

    default:
      return state;
  }
};

export default SignalReducer;
