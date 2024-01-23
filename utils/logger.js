const logger = (name) => (message) =>
  console.log(`${new Date().toLocaleString()} - [${name}] ${message}`);

module.exports = logger;
