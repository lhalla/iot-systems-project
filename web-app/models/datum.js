const mongoose = require("mongoose");

const datumSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  sensorType: {
    type: String,
    required: true
  },
  temperature: Number,
  humidity: Number,
  pressure: Number,
  eCO2: Number,
  VOC: Number
});

const Datum = mongoose.model("Datum", datumSchema);

module.exports = Datum;
