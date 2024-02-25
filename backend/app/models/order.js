const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  qty: Number,
});

const orderSchema = new Schema({
  items: [OrderItemSchema],
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now },
});

const Order = model("Order", orderSchema);
module.exports = Order;
