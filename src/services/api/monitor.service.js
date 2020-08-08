import axios from 'axios';

import ApiEndpoints from '../../consts/api.const.js';

class BaseMonitorApiService {

  static getRecords(url, boardName) {
    return new Promise((resolve) => {
      axios.get(`${url}?board_name=${boardName}`).then(response => {
        const results = response.data.results;

        const labels = results.map(result => result.created_at).map(item => new Date(item * 1000));
        const values = results.map(result => result.value).map(item => parseFloat(item));

        resolve({
          labels, values
        });
      });
    });
  }

  static purge(url, boardName) {
    url = `${url}/purge?board_name=${boardName}`;
    return new Promise(resolve => {
      axios.delete(url).then(response => {
        response = response.data;
        resolve(response);
      });
    });
  }
}

class TemperatureMonitorApiService {
  static getRecords(boardName) {
    return BaseMonitorApiService.getRecords(ApiEndpoints.MONITOR_TEMPERATURE, boardName);
  }

  static purge(boardName) {
    return BaseMonitorApiService.purge(ApiEndpoints.MONITOR_TEMPERATURE, boardName);
  }
}

class MoistureMonitorApiService {
  static getRecords(boardName) {
    return BaseMonitorApiService.getRecords(ApiEndpoints.MONITOR_MOISTURE, boardName);
  }

  static purge(boardName) {
    return BaseMonitorApiService.purge(ApiEndpoints.MONITOR_MOISTURE, boardName);
  }
}

export default class MonitorService {
  static temperature = TemperatureMonitorApiService;
  static moisture = MoistureMonitorApiService;
}
