import { MonitorActions, PinRegistryActions } from '../actions.const';
import PinRegistryService from '../../services/api/pin-registry.service';

export function registerPin(value) {
  PinRegistryService.register(value);

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

export function getTemperatureRecords() {
  return {
    type: MonitorActions.SET_TEMPERATURE
  };
}

export function onTemperatureChange(value) {
  return {
    type: MonitorActions.ON_TEMPERATURE_CHANGE,
    value
  };
}
