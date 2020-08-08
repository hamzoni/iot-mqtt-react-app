import MqttTopics from './topics.const';

const mqtt = require('mqtt');

export default class PinControlMqttService {

  client = mqtt.connect('mqtt://localhost:8883');
  topic = MqttTopics.SET_SIGNAL_VALUE;

  setValue(pin) {
    this.client.publish(this.topic, JSON.stringify(pin));
  }

  stop() {
    this.client.unsubscribe(this.topic);
    this.client.close();
  }
}
