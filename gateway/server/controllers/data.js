const dataRouter = require("express").Router();
const Datum = require("../models/datum");
const logger = require("../utils/logger");

dataRouter.post("/new", async (req, res, next) => {
  logger.info("[POST] received...");

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
    logger.info("[POST] received... a valid Datum");

    const datum = new Datum({
      temperature: temperature,
      humidity: humidity,
      eCO2: eCO2,
      VOC: VOC
    });

    try {
      const savedDatum = await datum.save();

      logger.info("[POST] datum saved to MongoDB");

      res.json(savedDatum);
    } catch (exception) {
      logger.error("[POST] validation failed");
      next(exception);
    }
  } else {
    logger.info("[POST] received... an invalid object");
    res.status(400).send({ error: "invalid format" });
  }
});

module.exports = dataRouter;
