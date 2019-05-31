const config = require("./utils/config");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const logger = require("./utils/serverLogger");
const middleware = require("./utils/middleware");

const app = express();

mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch(error => {
    logger.error("Error connecting to MongoDB:", error.message);
  });

app.use(express.static("build"));
app.use(cors());

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
