const dataRouter = require("express").Router();
const Datum = require("../models/datum");

dataRouter.get("/", async (req, res) => {
  const data = await Datum.find({});
  res.json(data.map(datum => datum.toJSON()));
});

module.exports = dataRouter;
