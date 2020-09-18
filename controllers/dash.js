const Stock = require("../models/stock");
const User = require("../models/user");

exports.getStocks = async (req, res, next) => {
  try {
    const uId = req.userId;

    const user = await User.findById(uId).populate("stocks");

    res.status(200).json({
      message: "Stocks retrieved",
      stocks: user.stocks,
      user: user.name,
    });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};

exports.addStock = async (req, res, next) => {
  try {
    const uId = req.userId;
    const symbol = req.body.symbol;
    const exchange = req.body.exchange;

    // Check if stock is in db
    const stock = await Stock.findOne({ symbol: symbol, exchange: exchange });
    if (!stock) {
      const error = new Error(
        `No stock found with symbol: ${symbol} and exchange: ${exchange}`
      );
      error.status = 422;
      throw error;
    }

    const user = await User.findById(uId);

    // Check if user has already favorited this stock
    if (user.stocks.find((el) => stock._id.equals(el))) {
      const error = new Error("Stock already favorited");
      error.status = 422;
      throw error;
    }

    user.stocks.push(stock);
    await user.save();

    res.status(201).json({
      message: "Stock added to favorites",
      stock: stock,
      user: user.name,
    });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};
