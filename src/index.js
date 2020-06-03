import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import * as serviceWorker from './serviceWorker';
import App from './App';
import { createStore } from 'redux';

import allReducers from './store/reducers'

const store = createStore(allReducers);

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>
  , document.getElementById('root'));

serviceWorker.unregister();
