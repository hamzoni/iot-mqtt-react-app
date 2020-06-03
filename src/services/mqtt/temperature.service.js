import MqttTopics from './topics.const';

const mqtt = require('mqtt');

export default class TemperatureMqttService {
  static run(cb) {
    this.client = mqtt.connect('mqtt://localhost:8883');

    const topic = MqttTopics.TEMPERATURE_TOPIC;

    this.client.on('connect', function() {
      this.client.subscribe(topic, function(err) {
        console.log(err ? err : `Subscribe to topic ${topic} success`);
      });
    });

    this.client.on('message', function(_topic, message) {
      if (_topic !== topic) {
        return;
      }
      cb({
        label: new Date().valueOf(),
        value: parseInt(message.toString())
      });
    });
  }
}
