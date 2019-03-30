const dataRouter = require("express").Router();
const Datum = require("../models/datum");
const logger = require("../utils/logger");

dataRouter.post("/new", async (req, res, next) => {
  logger.info("[GATEWAY::POST] Received...");

  const measurement = req.body;

  const temperature = measurement.temperature;
  const humidity = measurement.humidity;
  const eCO2 = measurement.eCO2;
  const VOC = measurement.VOC;

  if (
    temperature !== undefined &&
    humidity !== undefined &&
    eCO2 !== undefined &&
    VOC !== undefined
  ) {
    logger.info("[GATEWAY::POST] Received... a valid Datum");

    logger.info("[GATEWAY::POST] Adding a timestamp...");
    const datum = new Datum({
      date: new Date().toISOString(),
      temperature: temperature,
      humidity: humidity,
      eCO2: eCO2,
      VOC: VOC
    });

    try {
      const savedDatum = await datum.save();

      logger.info("[GATEWAY::POST] Datum saved to MongoDB");

      res.json(savedDatum);
    } catch (exception) {
      logger.error("[GATEWAY::POST] Validation failed");
      next(exception);
    }
  } else {
    logger.info("[GATEWAY::POST] Received... an invalid object");
    res.status(400).send({ error: "Invalid format" });
  }
});

module.exports = dataRouter;
