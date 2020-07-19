import MqttTopics from './topics.const';

const mqtt = require('mqtt');

export default class TemperatureMqttService {
  static run(cb) {
    const client = mqtt.connect('mqtt://localhost:8883');

    const topic = MqttTopics.TEMPERATURE_TOPIC;

    client.on('connect', function() {
      client.subscribe(topic, function(err) {
        console.log(err ? err : `Subscribe to topic ${topic} success`);
      });
    });

    client.on('message', function(_topic, message) {
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
