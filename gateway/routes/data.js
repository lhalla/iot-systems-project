const dataRouter = require("express").Router();
const { Datum, supportedMeasurements } = require("../models/datum");
const logger = require("../utils/gatewayLogger");
const ip = require("public-ip");
const axios = require("axios");

let sensorIp = "";

dataRouter.post("/new", async (req, res, next) => {
  const measurement = req.body;

  const hasSensorType = measurement.sensorType !== undefined;
  const hasASupportedMeasurement = supportedMeasurements.some(
    sup => measurement[sup] !== undefined
  );

  if (hasSensorType && hasASupportedMeasurement) {
    logger.info(
      `Received a JSON with valid attributes: ${JSON.stringify(measurement)}`
    );

    sensorIp = measurement.sensorType;

    logger.info(await ip.v4());

    logger.info("Adding a timestamp...");
    measurement.date = new Date().toISOString();
    measurement.gw = await ip.v4();

    const datum = new Datum(measurement);

    try {
      const savedDatum = await datum.save();

      logger.info("Measurement saved to MongoDB");

      res.json(savedDatum);
    } catch (exception) {
      next(exception);
    }
  } else {
    logger.info(`Received an invalid object: ${JSON.stringify(measurement)}`);
    res.status(400).send({ error: "Invalid format" });
  }
});

dataRouter.post("/togglefan", async (req, res, next) => {
  logger.info("+++++++");
  res.status(404).send({ error: "success" });
});

module.exports = dataRouter;
