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
    type: String,
    required: true
  },
  img: {
    type: String,
    require: true
  },
  create_date: {
    type: Date,
    default: Date.now
  }
});

const Item = mongoose.model("items", itemSchema);

module.exports = Item;
