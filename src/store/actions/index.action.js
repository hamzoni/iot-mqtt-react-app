import { MonitorActions, PinRegistryActions } from '../actions.const';
import { PinType } from 'consts/pin.const';
import { PinStatus } from '../../consts/pin.const';
import { PinControlActions } from '../actions.const';
import PinControlService from '../../services/api/pin-control.service';

// Pin control actions
export function updatePinValue(params) {
  const { pin, value } = params;

  if (value === undefined) {
    return {
      type: PinControlActions.SET_VALUE,
      value
    };
  }

  if (pin.type === PinType.DIGITAL) {
    const isTurnOn = value === PinStatus.ON;

    if (isTurnOn) {
      PinControlService.turnOn(pin.board_name, pin.pin_name);
    } else {
      PinControlService.turnOff(pin.board_name, pin.pin_name);
    }

    const type = isTurnOn ?
      PinControlActions.TURN_ON :
      PinControlActions.TURN_OFF;

    return {
      type, value: pin
    };
  }

  PinControlService.setValue(pin.board_name, pin.pin_name, value);
  return {
    type: PinControlActions.SET_VALUE,
    value
  };
}

// Pin registry actions
export function removePin(value) {
  return {
    type: PinRegistryActions.REMOVE,
    value
  };
}

export function registerPin(value) {
  return {
    type: PinRegistryActions.REGISTER,
    value
  };
}

export function listAllPins() {
  return {
    type: PinRegistryActions.LIST_ALL
  };
}

export function listAllBoards() {
  return {
    type: PinRegistryActions.LIST_ALL_BOARDS
  };
}

// Monitoring actions
export function getTemperatureRecords(boardName) {
  return {
    type: MonitorActions.SET_TEMPERATURE,
    value: boardName,
  };
}

export function onTemperatureChange(value) {
  console.log(`Temperature: ${value}`);
  return {
    type: MonitorActions.ON_TEMPERATURE_CHANGE,
    value
  };
}

export function getMoistureRecords(boardName) {
  return {
    type: MonitorActions.SET_MOISTURE,
    value: boardName,
  };
}

export function onMoistureChange(value) {
  console.log(`Moisture: ${value}`);
  return {
    type: MonitorActions.ON_MOISTURE_CHANGE,
    value
  };
}
