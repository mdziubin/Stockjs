const Stock = require("../models/stock");
const User = require("../models/user");
const mongoose = require("mongoose");

exports.getStocks = async (req, res, next) => {
  try {
    const uId = req.userId;
    const currentPage = req.query.page || 1;
    const perPage = req.query.per || 10;

    // Query the user info but paginate the favorited stocks using slice([<skip, perPage>])
    const userQuery = User.findById(uId)
      .slice("stocks", [perPage * (currentPage - 1), +perPage])
      .populate("stocks");
    const user = await userQuery.exec();

    // Find total count resulting from unpaginated query
    const [{ count }] = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(uId) } },
      { $project: { _id: 0, count: { $size: "$stocks" } } },
    ]);

    res.status(200).json({
      message: "Stocks retrieved",
      stocks: user.stocks,
      count: count,
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

    // Check if stock is in db
    const stock = await Stock.findOne({ symbol: symbol });
    if (!stock) {
      const error = new Error(`No stock found with symbol: ${symbol}`);
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

exports.delStock = async (req, res, next) => {
  try {
    const uId = req.userId;
    const sId = req.params.stockId;

    const user = await User.findById(uId);

    // Check if user has this stock in favorites
    if (!user.stocks.find((el) => el._id.equals(sId))) {
      const error = new Error("Cannot delete stock not in favorites");
      error.status = 422;
      throw error;
    }

    // Delete the stock locally and then save changes
    user.stocks.pull(sId);
    await user.save();

    res.status(200).json({ message: "Deleted favorited stock" });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};
