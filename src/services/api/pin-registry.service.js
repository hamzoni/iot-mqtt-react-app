import axios from 'axios';
import { NotificationManager } from 'react-notifications';

import ApiEndpoints from '../../consts/api.const.js';

export default class PinRegistryService {
  
  static listAllBoards() {
    const url = `${ApiEndpoints.SIGNAL_REGISTRY}/boards`;
    return new Promise(resolve => {
      axios.get(url).then(response => {
        resolve(response.data);
      });
    });
  }

  static listAll() {
    const url = ApiEndpoints.SIGNAL_REGISTRY;
    return new Promise(resolve => {
      axios.get(url).then(response => {
        resolve(response.data);
      });
    });
  }

  static register(dto) {
    const url = ApiEndpoints.SIGNAL_REGISTRY;
    dto = dto.loadForward();

    return new Promise(resolve => {
      axios.post(url, dto).then(response => {
        if (response.status === 200 && response.data && response.data.result) {
          NotificationManager.success(`Register pin ${dto.pin_name} successful`);
        }
        resolve(response.data);
      });
    });
  }

  static remove(boardName, pinName) {
    const url = `${ApiEndpoints.SIGNAL_REGISTRY}/${boardName}/${pinName}`;
    return new Promise(resolve => {
      axios.delete(url).then(response => {
        resolve(response.data);
      });
    });
  }
}
