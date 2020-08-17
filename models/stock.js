const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockSchema = new Schema({
  ticker: {
    type: String,
    required: true,
    maxlength: 6,
  },
  exchange: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Stock", stockSchema);
