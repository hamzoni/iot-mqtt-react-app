import axios from 'axios';

import ApiEndpoints from '../../consts/api.const.js';

export class TemperatureMonitorApiService {

  // get records in a time range
  static getRecords(cb) {
    const url = ApiEndpoints.MONITOR_TEMPERATURE;
    axios.get(url).then(response => {
      const results = response.data.results;

      const labels = results.map(result => result.created_at).map(item => new Date(item * 1000));
      const values = results.map(result => result.value).map(item => parseFloat(item));
      cb({
        labels, values
      });
    });
  }

  static purge() {
    const url = `${ApiEndpoints.MONITOR_TEMPERATURE}/purge`;
    axios.delete(url).then(response => {
      console.log(response.data);
    });
  }
}

export default class MonitorService {
  static temperature = TemperatureMonitorApiService;
}
