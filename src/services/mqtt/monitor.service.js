import MqttTopics from './topics.const';

const mqtt = require('mqtt');

export default class MonitorMqttService {

  client = mqtt.connect('mqtt://localhost:8883');

  topics = [MqttTopics.TEMPERATURE_CHANGE, MqttTopics.MOISTURE_CHANGE];
  boards = [];
  mappedTopics = [];

  activeBoard = '';

  constructor(boards) {
    this.boards = boards ? boards : [];

    // modify topics with available boards
    const mappedTopics = [];

    this.topics.forEach(topic => {
      this.boards.forEach(board => {
        const _topic = `${board}_${topic}`;
        mappedTopics.push(_topic);
        this.client.subscribe(_topic, err => {
          console.log(err ? err : `Subscribe to topic ${_topic} success`);
        });
      });
    });

    this.mappedTopics = mappedTopics;

    // default active board is the first board
    if (boards && boards.length > 0) {
      this.activeBoard = boards[0];
    }
  }

  setActiveBoard(board) {
    this.activeBoard = board;
  }

  subscribe(callback, topic) {
    this.client.on('message', (_topic, message) => {
      if (_topic !== `${this.activeBoard}_${topic}`) {
        return;
      }
      callback({
        label: new Date().valueOf(),
        value: parseInt(message.toString())
      });
    });
  }

  stop() {
    this.mappedTopics.forEach(this.client.unsubscribe);
    this.client.end(true);
  }
}
