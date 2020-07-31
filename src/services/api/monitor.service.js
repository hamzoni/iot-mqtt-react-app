import axios from 'axios';

import ApiEndpoints from '../../consts/api.const.js';

export class TemperatureMonitorApiService {

  // get records in a time range
  static getRecords() {
    const url = ApiEndpoints.MONITOR_TEMPERATURE;
    return new Promise((resolve) => {
      axios.get(url).then(response => {
        const results = response.data.results;

        const labels = results.map(result => result.created_at).map(item => new Date(item * 1000));
        const values = results.map(result => result.value).map(item => parseFloat(item));

        resolve({
          labels, values
        });
      });
    });

  }

  static purge() {
    const url = `${ApiEndpoints.MONITOR_TEMPERATURE}/purge`;
    return new Promise(resolve => {
      axios.delete(url).then(response => {
        response = response.data;
        resolve(response);
      });
    });

  }
}

export default class MonitorService {
  static temperature = TemperatureMonitorApiService;
}
