const { validationResult } = require("express-validator");

const Exchange = require("../models/exchange");
const Stock = require("../models/stock");

const stockName = require("../util/stockName");

exports.addExchange = (req, res, next) => {
  const symbol = req.body.symbol;
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
  const exchange = new Exchange({ exchange: symbol, name: name });
  exchange
    .save()
    .then((result) => {
      res.status(201).json({ message: "Exchange added", exchange: exchange });
    })
    .catch((err) => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
};

exports.addStock = async (req, res, next) => {
  try {
    // Check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.status = 422;
      error.data = errors.array();
      throw error;
    }

    const symbol = req.body.symbol;
    const exchange = req.body.exchange;

    // Get full stock name
    const name = await stockName(symbol);

    // Save stock to db
    const stock = new Stock({
      name: name,
      symbol: symbol,
      exchange: exchange,
    });
    await stock.save();

    // Response
    res.status(201).json({ message: "Stock added", stock: stock });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};
