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
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.addStock = async (req, res, next) => {
  try {
    const uId = req.userId;
    const sId = req.body.sId;

    const stock = await Stock.findById(sId);

    if (!stock) {
      const error = new Error("Invalid stock id provided, no record");
      error.statusCode = 422;
      throw error;
    }

    const user = await User.findById(uId);

    user.stocks.push(stock);
    await user.save();

    res.status(201).json({
      message: "Stock added to favorites",
      stock: stock,
      user: user.name,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
