import { all, call, put, takeEvery } from 'redux-saga/effects';

import MonitorService from '../../services/api/monitor.service';
import { MonitorActions, PinRegistryActions } from '../actions.const';
import PinRegistryService from '../../services/api/pin-registry.service';

function* registerPin(action) {
  yield call(PinRegistryService.register, action.value);
  yield put({ type: PinRegistryActions.LIST_ALL });
}

function* fetchListAllPins() {
  const value = yield call(PinRegistryService.listAll);
  yield put({ type: PinRegistryActions.LIST_ALL_SUCCESS, value });
}

function* fetchListAllBoards() {
  const value = yield call(PinRegistryService.listAllBoards);
  yield put({ type: PinRegistryActions.LIST_ALL_BOARDS_SUCCESS, value });
}

function* fetchTemperatureRecords(action) {
  const value = yield call(MonitorService.temperature.getRecords, action.value);
  yield put({ type: MonitorActions.SET_TEMPERATURE_SUCCESS, value });
}

function* fetchMoistureRecords(action) {
  const value = yield call(MonitorService.moisture.getRecords, action.value);
  yield put({ type: MonitorActions.SET_MOISTURE_SUCCESS, value });
}

// callable saga
function* registerPinAsync() {
  yield takeEvery(PinRegistryActions.REGISTER, registerPin);
}

function* fetchListAllPinsAsync() {
  yield takeEvery(PinRegistryActions.LIST_ALL, fetchListAllPins);
}

function* fetchListAllBoardsAsync() {
  yield takeEvery(PinRegistryActions.LIST_ALL_BOARDS, fetchListAllBoards);
}

function* fetchTemperatureRecordsAsync() {
  yield takeEvery(MonitorActions.SET_TEMPERATURE, fetchTemperatureRecords);
}

function* fetchMoistureRecordsAsync() {
  yield takeEvery(MonitorActions.SET_MOISTURE, fetchMoistureRecords);
}

// define root saga
export default function* rootSaga() {
  yield all([
    registerPinAsync(),
    fetchListAllPinsAsync(),
    fetchListAllBoardsAsync(),
    fetchTemperatureRecordsAsync(),
    fetchMoistureRecordsAsync()
  ]);
}
