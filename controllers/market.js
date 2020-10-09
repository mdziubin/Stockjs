const { validationResult } = require("express-validator");

const Exchange = require("../models/exchange");
const Stock = require("../models/stock");

const stockName = require("../util/stockName");

exports.getStocks = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;
    const filter = req.query.filter;
    const perPage = 18;

    // Case insensitive "contains" query filter of name and symbol fields in stock collection
    const queryFilter = {
      $or: [
        { name: { $regex: `.*${filter}.*`, $options: "i" } },
        { symbol: { $regex: `.*${filter.toUpperCase()}.*` } },
      ],
    };

    // Find total count resulting from query
    const queryCount = await Stock.countDocuments(queryFilter);

    // Get a paginated sample of the same query
    const stocksQuery = Stock.find(queryFilter)
      .limit(perPage)
      .skip(perPage * (currentPage - 1))
      .sort({ symbol: "asc" });

    // TODO: Aggregate the count and limit query to save on compute power

    const stocks = await stocksQuery.exec();

    res.status(200).json({
      message: "Stocks retrieved",
      stocks: stocks,
      pages: Math.ceil(queryCount / perPage),
    });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};

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
