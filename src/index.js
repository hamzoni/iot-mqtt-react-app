import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, useDispatch } from 'react-redux';

import * as serviceWorker from './serviceWorker';
import App from './App';
import { createStore } from 'redux';

import allReducers from './store/reducers';
import TemperatureMqttService from './services/mqtt/temperature.service';
import { updateData } from './store/actions';

const store = createStore(allReducers);

const dispatch = useDispatch();

TemperatureMqttService.run(value => {
  dispatch(updateData(value));
});


ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>
  , document.getElementById('root'));

serviceWorker.unregister();
