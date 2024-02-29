const {
  enoughToSupply,
  updateProductQuantity,
  getPrice,
} = require("../services/product");
const {
  createOrder,
  getOrdersByPage,
  getOrderById,
  updateOrder,
  deleteOrder,
  amountOfOrders,
  getTotalPrice,
} = require("../services/order");

module.exports = {
  create: async (req, res) => {
    try {
      const order = req.body;
      const items = order.items;
      let promiseArr = items.map((i) => enoughToSupply(i.productId, i.qty));
      const enough = await Promise.all(promiseArr);
      if (enough.includes(false)) {
        return res.status(400).json("Not enough in stock");
      }
      promiseArr = items.map((i) => updateProductQuantity(i.productId, i.qty));
      await Promise.all(promiseArr);
      const newOrder = await createOrder({
        items: order.items,
        totalPrice: order.totalPrice,
      });
      res.json(newOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getById: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json("missing required fields");
      }
      const order = await getOrderById(id);
      if (!order) {
        return res.status(404).json("Order not found");
      }
      res.json(order);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateOrder: async (req, res) => {
    try {
      const id = req.params.id;
      const updatedFields = req.body;
      const updatedOrder = await updateOrder(id, updatedFields);
      res.json(updatedOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteOrder: async (req, res) => {
    try {
      const id = req.params.id;
      const deletedOrder = await deleteOrder(id);
      if (!deletedOrder) {
        return res.status(404).json("Order not found");
      }
      res.json(deletedOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  amountOfOrders: async (req, res) => {
    try {
      const amount = await amountOfOrders();
      res.json(amount);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
