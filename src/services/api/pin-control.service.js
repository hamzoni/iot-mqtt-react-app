import axios from 'axios';

import ApiEndpoints from '../../consts/api.const.js';

export default class PinControlService {
  turnOn(boardName, pinName) {
    const url = `${ApiEndpoints.SIGNAL_CONTROL}/${boardName}/${pinName}/on`;
    axios.post(url).then(response => {
      console.log(response.data);
    });
  }

  turnOff(boardName, pinName) {
    const url = `${ApiEndpoints.SIGNAL_CONTROL}/${boardName}/${pinName}/off`;
    axios.post(url).then(response => {
      console.log(response.data);
    });
  }

  setValue(boardName, pinName, value) {
    const url = `${ApiEndpoints.SIGNAL_CONTROL}/${boardName}/${pinName}?value=${value}`;
    axios.post(url).then(response => {
      console.log(response.data);
    });
  }
}
