import axios from 'axios';

import ApiEndpoints from './apis.const.js';

export default class TemperatureApiService {

  static getIndices(cb) {
    const url = ApiEndpoints.ROOT;
    axios.get(url).then(response => {
      const results = response.data.results;

      const labels = results.map(result => result.created_at).map(item => new Date(item * 1000));
      const values = results.map(result => result.value).map(item => parseFloat(item));

      cb({
        labels, values
      });
    });
  }

}
