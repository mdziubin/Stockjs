// Package Imports
const express = require("express");

// Route Imports
const testRoutes = require("./routes/test.js");

const app = express();

app.use("/test", testRoutes);

app.listen(8080);
