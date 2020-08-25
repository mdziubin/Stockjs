const express = require("express");

const dashController = require("../controllers/dash");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// GET /dash/stocks
router.get("/stocks", isAuth, dashController.getStocks);

// POST /dash/stock
router.post("/stock", isAuth, dashController.addStock);

module.exports = router;
