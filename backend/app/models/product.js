const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: String,
  img: String,
  description: String,
  price: Number,
  inStock: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = model("Product", productSchema);
module.exports = Product;
