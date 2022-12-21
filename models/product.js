const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: [true, "product name must be provided"] },
  price: { type: Number, required: [true, "product price must be provided"] },
  featured: { type: Boolean, default: false },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: [true, "product name must be provided"],
  },
  created_at: { type: Date, default: Date.now() },
  company: {
    type: String,
    enum: ["ikea", "liddy", "marcos", "caressa", "goodwill", "costco"],
    message: "{VALUE} is not supported",
  },
});

module.exports = mongoose.model("Product", ProductSchema);
