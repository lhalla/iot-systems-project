const mongoose = require("mongoose");

const supportedMeasurements = [
  "temperature",
  "humidity",
  "pressure",
  "eCO2",
  "VOC"
];

const schemaDefinition = {
  date: {
    type: String,
    required: true
  },
  sensorType: {
    type: String,
    required: true
  },
  fan: {
    type: String
  },
  gw: {
    type: String
  }
};

supportedMeasurements.forEach(sup => (schemaDefinition[sup] = Number));

const datumSchema = new mongoose.Schema(schemaDefinition);

const Datum = mongoose.model("Datum", datumSchema);

module.exports = { Datum, supportedMeasurements };
