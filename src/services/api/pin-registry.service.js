import axios from 'axios';

import ApiEndpoints from './apis.const.js';

export default class PinRegistryService {
  static listAll() {
    const url = ApiEndpoints.SIGNAL_REGISTRY;
    axios.get(url).then(response => {
      console.log(response.data);
    });
  }

  static register(dto) {
    const url = ApiEndpoints.SIGNAL_REGISTRY;
    dto = dto.loadForward();
    axios.post(url, dto).then(response => {
      console.log(response.data);
    });
  }

  static remove(boardName, pinName) {
    const url = `${ApiEndpoints.SIGNAL_REGISTRY}/${boardName}/${pinName}`;
    axios.delete(url).then(response => {
      console.log(response.data);
    });
  }
}
