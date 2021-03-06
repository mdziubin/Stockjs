const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const exchangeSchema = new Schema({
  exchange: {
    type: String,
    required: true,
    maxlength: 10,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Exchange", exchangeSchema);
