const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId
  },
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  create_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Item", itemSchema);
