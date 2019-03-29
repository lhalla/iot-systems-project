const Datum = require("../models/datum");

const dataInDB = async () => {
  const data = await Datum.find({});
  return data.map(datum => datum.toJSON());
};

module.exports = {
  dataInDB
};
