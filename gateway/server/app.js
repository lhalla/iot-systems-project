const config = require("./utils/config");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const bodyParser = require("body-parser");
const dataRouter = require("./controllers/data");
const middleware = require("./utils/middleware");

const app = express();

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => logger.info("connected to MongoDB"))
  .catch(error => logger.error("error connecting to MongoDB:", error.message));

app.use(bodyParser.json());

app.use("/api/data", dataRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
