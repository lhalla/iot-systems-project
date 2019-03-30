const mongoose = require("mongoose");

const datumSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  eCO2: {
    type: Number,
    required: true
  },
  VOC: {
    type: Number,
    required: true
  }
});

const Datum = mongoose.model("Datum", datumSchema);

module.exports = Datum;
