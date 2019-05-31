const config = require("./utils/config");

const app = require("./app");
const http = require("http");

const logger = require("./utils/gatewayLogger");

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Running on port ${config.PORT}`);
});
