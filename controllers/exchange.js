const { validationResult } = require("express-validator");

const Exchange = require("../models/exchange.js");

exports.addExchange = (req, res, next) => {
  const abv = req.body.abv;
  const name = req.body.name;

  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.status = 422;
    error.data = errors.array();
    throw error;
  }

  // Create exchange object and save
  const exchange = new Exchange({ abv: abv, name: name });
  exchange
    .save()
    .then((result) => {
      res.status(201).json({ message: "Exchange added", exchange: exchange });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
