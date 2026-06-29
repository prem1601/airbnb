const mongoose = require("mongoose");
const User = require("./userModel");

const homeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  image: String,
  description: String,
});

module.exports = mongoose.model("Home", homeSchema);
