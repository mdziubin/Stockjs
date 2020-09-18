const express = require("express");
const { body } = require("express-validator");

const Exchange = require("../models/exchange");
const Stock = require("../models/stock");

const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");

const adminController = require("../controllers/admin");

const router = express.Router();

// Post admin/market/exchange
// Add an exchange to db
router.post(
  "/market/exchange",
  isAuth,
  isAdmin,
  [
    body("exchange")
      .trim()
      .isLength({ max: 10, min: 1 })
      .custom(async (value, { req }) => {
        const exDoc = await Exchange.findOne({ exchange: value });
        if (exDoc) {
          return Promise.reject("Exchange already added");
        }
      }),
    body("name").trim().not().isEmpty(),
  ],
  adminController.addExchange
);

// Post admin/market/stock
// Add an individual stock to db
router.post(
  "/market/stock",
  isAuth,
  isAdmin,
  [
    body("exchange")
      .trim()
      .custom(async (value, { req }) => {
        const exDoc = await Exchange.findOne({ exchange: value });
        if (!exDoc) {
          console.log(exDoc);
          return Promise.reject("Exchange not supported");
        }
      }),
    body("symbol")
      .trim()
      .not()
      .isEmpty()
      .custom(async (value, { req }) => {
        const stock = await Stock.findOne({
          symbol: value,
          exchange: req.body.exchange,
        });
        if (stock) {
          return Promise.reject("Stock already added");
        }
      }),
  ],
  adminController.addStock
);

module.exports = router;
