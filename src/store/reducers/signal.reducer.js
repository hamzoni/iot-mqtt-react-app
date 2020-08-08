import { PinControlActions, PinRegistryActions } from '../actions.const';
import { cloneDeep } from 'lodash';
import PinRegistryService from '../../services/api/pin-registry.service';
import { BoardConfig, PinStatus } from '../../consts/pin.const';


class InitialState {
  pins: {};
  boards: [];
}

const changePinStatus = (state, action, status) => {
  const _pins = state.pins;
  const _boardName = action.value.board_name;

  for (let i = 0; i < _pins[_boardName].length; i++) {
    if (_pins[_boardName][i].pin_name !== action.value.pin_name) {
      continue;
    }
    _pins[_boardName][i].digital_value = status;
  }

  return cloneDeep(_pins);
};

const parseListAllPins = (response) => {
  const results = {};

  for (const item of response.results) {
    if (!item.board_name) {
      item.board_name = 'Unknown';
    }

    if (!results[item.board_name]) {
      results[item.board_name] = [];
    }
    results[item.board_name].push(item);
  }

  return results;
};

const parseListAllBoards = (response) => {
  return response.results;
};

const SignalReducer = (state = new InitialState(), action) => {
  switch (action.type) {
    case PinControlActions.TURN_ON: {
      return {
        ...state,
        pins: changePinStatus(state, action, PinStatus.ON)
      };
    }

    case PinControlActions.TURN_OFF: {
      return {
        ...state,
        pins: changePinStatus(state, action, PinStatus.OFF)
      };
    }


    // case PinControlActions.SET_VALUE:
    //   return {
    //     ...state
    //   };

    case PinRegistryActions.REMOVE: {
      const pinName = action.value.pinName;
      let boardName = action.value.boardName;

      const boardNameApi = BoardConfig.DEFAULT_NAME === boardName ? '' : boardName;

      PinRegistryService.remove(boardNameApi, pinName);

      const pins = state.pins;

      // find pin index in board
      pins[boardName] = pins[boardName].filter(pin => pin.pin_name !== pinName);

      if (pins[boardName].length === 0) {
        delete pins[boardName];
      }

      return {
        ...state,
        pins: cloneDeep(pins)
      };
    }

    case PinRegistryActions.LIST_ALL_SUCCESS: {
      return {
        ...state,
        pins: parseListAllPins(action.value)
      };
    }

    case PinRegistryActions.LIST_ALL_BOARDS_SUCCESS: {
      return {
        ...state,
        boards: parseListAllBoards(action.value)
      };
    }

    default: {
      return state;
    }
  }
};

export default SignalReducer;
