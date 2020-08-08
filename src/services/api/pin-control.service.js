import axios from 'axios';

import ApiEndpoints from '../../consts/api.const.js';

export default class PinControlService {
  static turnOn(boardName, pinName) {
    const url = `${ApiEndpoints.SIGNAL_CONTROL}/${boardName}/${pinName}/on`;
    return new Promise(resolve => {
      axios.post(url).then(response => {
        resolve(response.data);
      });
    });
  }

  static turnOff(boardName, pinName) {
    const url = `${ApiEndpoints.SIGNAL_CONTROL}/${boardName}/${pinName}/off`;
    return new Promise(resolve => {
      axios.post(url).then(response => {
        resolve(response.data);
      });
    });
  }

  static setValue(boardName, pinName, value) {
    const url = `${ApiEndpoints.SIGNAL_CONTROL}/${boardName}/${pinName}?value=${value}`;
    return new Promise(resolve => {
      axios.post(url).then(response => {
        resolve(response.data);
      });
    });
  }
}
