const config = require("./utils/config");

const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const bodyParser = require("body-parser");
const dataRouter = require("./routes/data");
const middleware = require("./utils/middleware");

const logger = require("./utils/gatewayLogger");

const app = express();

mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => logger.info("Connected to MongoDB"))
  .catch(error => logger.error("Error connecting to MongoDB:", error.message));

app.use(bodyParser.json());
app.use(cors());

app.use("/api/data", dataRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
