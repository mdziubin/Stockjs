const express = require("express");

const testController = require("../controllers/test.js");

const router = express.Router();

// GET /test/message
router.get("/message", testController.getMessage);

module.exports = router;
