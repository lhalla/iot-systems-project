const config = require("./utils/config");

const app = require("./app");
const http = require("http");
const socketIo = require("socket.io");

const Datum = require("./models/datum");

const logger = require("./utils/serverLogger");

const server = http.createServer(app);
const io = socketIo(server);

const PUBLISH_INTERVAL_MS = 5000;

/* Simultaneously update every client. */
let interval;
io.on("connection", socket => {
  logger.info("New client connected");

  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => publishData(socket), PUBLISH_INTERVAL_MS);

  socket.on("disconnect", () => logger.info("Client disconnected"));
});

/**
 * Sends a fresh set of data from the MongoDB to all clients.
 * @param {*} socket connected client
 */
const publishData = async socket => {
  try {
    const data = await Datum.find({});

    logger.info("Publishing data...");

    socket.emit("FromAPI", data.slice(-50));
  } catch (error) {
    logger.error(`Error sending data to clients: ${error.code}`);
  }
};

server.listen(config.PORT, () => {
  logger.info(`Running on port ${config.PORT}`);
});
