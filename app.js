// Package Imports
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

// Route Imports
const testRoutes = require("./routes/test.js");
const authRoutes = require("./routes/auth.js");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use("/test", testRoutes);
app.use("/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
