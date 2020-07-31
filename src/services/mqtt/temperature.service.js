import MqttTopics from './topics.const';

const mqtt = require('mqtt');

export default class TemperatureMqttService {

  client = mqtt.connect('mqtt://localhost:8883');
  topic = MqttTopics.TEMPERATURE_TOPIC;

  start(callback) {
    this.client.subscribe(this.topic, err => {
      console.log(err ? err : `Subscribe to topic ${this.topic} success`);
    });

    this.client.on('message', (_topic, message) => {

      if (_topic !== this.topic) {
        return;
      }

      callback({
        label: new Date().valueOf(),
        value: parseInt(message.toString())
      });
    });
  }

  stop() {
    this.client.unsubscribe(this.topic);
    this.client.close();
  }
}
