export class MonitorActions {
  static ON_TEMPERATURE_CHANGE = 'ON_TEMPERATURE_CHANGE';

  static SET_TEMPERATURE = 'SET_TEMPERATURE';
  static SET_TEMPERATURE_SUCCESS = 'SET_TEMPERATURE_SUCCESS';
}

export class PinControlActions {
  static TURN_ON = 'TURN_ON';
  static TURN_OFF = 'TURN_OFF';
  static SET_VALUE = 'SET_VALUE';
}

export class PinRegistryActions {
  static REGISTER = 'REGISTER';
  static LIST_ALL = 'LIST_ALL';
  static LIST_ALL_SUCCESS = 'LIST_ALL_SUCCESS';
  static REMOVE = 'REMOVE';
}
