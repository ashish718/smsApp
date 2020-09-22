const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  urlCode: String,
  longUrl: String,
  shortUrl: String,
  followUp: Array,
  shop: String,
  id: Number,
  price: Number,
  shop: String
  // name: String
});

module.exports = mongoose.model("Url", urlSchema);
