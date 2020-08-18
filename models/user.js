const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  perm: {
    type: String,
    default: "user",
  },
  stocks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Stock",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
