const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
  name: String,
  admin: { type: Boolean, default: false },
  cart: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      qty: Number,
    },
  ],
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = model("User", userSchema);
module.exports = User;
