const mongoose = require("mongoose");
const Favourite = require("./favouriteModal");

const homeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  image: String,
  description: String,
});

homeSchema.pre("findOneAndDelete", function (next) {
  Favourite.deleteMany({ homeId: this.getQuery()._id.toString() })
    .then((result) => console.log("Favourites deleted successfully", result))
    .catch((err) => console.log(err));
});

module.exports = mongoose.model("Home", homeSchema);
