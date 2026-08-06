const http = require('http');
const app = require('./app');
const logger = require('./config/logger');

const port = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});

module.exports = server;
