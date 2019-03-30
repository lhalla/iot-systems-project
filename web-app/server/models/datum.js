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

datumSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret._id = ret._id.toString();
    delete ret.__v;

    if (ret.humidity === -1) {
      delete ret.humidity;
    }

    if (ret.eCO2 === -1) {
      delete ret.eCO2;
    }

    if (ret.VOC === -1) {
      delete ret.VOC;
    }
  }
});

const Datum = mongoose.model("Datum", datumSchema);

module.exports = Datum;
