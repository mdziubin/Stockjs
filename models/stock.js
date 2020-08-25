const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  symbol: {
    type: String,
    required: true,
    maxlength: 6,
  },
  exchange: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Stock", stockSchema);
