export default class ApiEndpoints {
  static ROOT = `http://localhost:9000`;
  static MONITOR_TEMPERATURE = `${ApiEndpoints.ROOT}/monitor/temperature`;
  static MONITOR_MOISTURE = `${ApiEndpoints.ROOT}/monitor/moisture`;
  static SIGNAL_REGISTRY = `${ApiEndpoints.ROOT}/signal/pin-registry`;
  static SIGNAL_CONTROL = `${ApiEndpoints.ROOT}/signal/pin-control`;
}
