const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const productsRouter = require("./routes/product");
const usersRouter = require("./routes/user");
const orderRouter = require("./routes/order");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/orders", orderRouter);

module.exports = app;
