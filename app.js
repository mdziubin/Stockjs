// Package Imports
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// Route Imports
const testRoutes = require("./routes/test.js");

const app = express();
app.use("/test", testRoutes);

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
