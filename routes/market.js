const express = require("express");
const { body } = require("express-validator");

const Exchange = require("../models/exchange.js");
const isAuth = require("../middleware/is-auth.js");
const isAdmin = require("../middleware/is-admin.js");
const exchangeController = require("../controllers/exchange.js");

const router = express.Router();

// Post /exchange
router.post(
  "/exchange",
  isAuth,
  isAdmin,
  [
    body("abv")
      .trim()
      .isLength({ max: 10, min: 1 })
      .custom(async (value, { req }) => {
        const exDoc = await Exchange.findOne({ abv: value });
        if (exDoc) {
          return Promise.reject("Exchange already added");
        }
      }),
    body("name").trim().not().isEmpty(),
  ],
  exchangeController.addExchange
);

module.exports = router;
