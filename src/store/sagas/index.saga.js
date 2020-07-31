import { all, call, put, takeEvery } from 'redux-saga/effects';

import MonitorService from '../../services/api/monitor.service';
import { MonitorActions, PinRegistryActions } from '../actions.const';
import PinRegistryService from '../../services/api/pin-registry.service';

function* fetchListAllPins() {
  const value = yield call(PinRegistryService.listAll);
  yield put({ type: PinRegistryActions.LIST_ALL_SUCCESS, value });
}

function* fetchTemperatureRecords() {
  const value = yield call(MonitorService.temperature.getRecords);
  yield put({ type: MonitorActions.SET_TEMPERATURE_SUCCESS, value });
}

// callable saga
function* fetchListAllPinsAsync() {
  yield takeEvery(PinRegistryActions.LIST_ALL, fetchListAllPins);
}

function* fetchTemperatureRecordsAsync() {
  yield takeEvery(MonitorActions.SET_TEMPERATURE, fetchTemperatureRecords);
}

// define root saga
export default function* rootSaga() {
  yield all([
    fetchListAllPinsAsync(),
    fetchTemperatureRecordsAsync()
  ]);
}
