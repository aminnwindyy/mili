const EventEmitter = require('events');

class EventBus extends EventEmitter {}

// Singleton event bus
const bus = new EventBus();

module.exports = bus;


