// Package Imports
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

require("dotenv").config();
// const loadDb = require("./util/loadStocks");

// Route Imports
const testRoutes = require("./routes/test");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const dashRoutes = require("./routes/dash");

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
app.use("/admin", adminRoutes);
app.use("/dash", dashRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.status || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.MONGO_URL, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(8080);
    console.log("Server running");
  })
  .catch((err) => {
    console.log(err);
  });

// Function to terminate app gracefully
const gracefulShutdown = () => {
  // First argument is [force], see mongoose doc.
  mongoose.connection.close(false, () => {
    console.log("MongoDb connection closed.");
    process.exit(0);
  });
};

// This will handle kill commands, such as CTRL+C:
process.on("SIGINT", gracefulShutdown);

// Function for server closing
app.serverClose = () => {
  gracefulShutdown();
};

// Export app for testing
module.exports = app;
