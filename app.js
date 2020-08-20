// Package Imports
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
// const loadDb = require("./util/loadStocks");

// Route Imports
const testRoutes = require("./routes/test.js");
const authRoutes = require("./routes/auth.js");
const marketRoutes = require("./routes/market.js");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/test", testRoutes);
app.use("/auth", authRoutes);
app.use("/market", marketRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.status || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    app.listen(8080);
  })
  .then((result) => {
    // loadDb();
  })
  .catch((err) => {
    console.log(err);
  });
