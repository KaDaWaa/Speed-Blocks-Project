const {
  login,
  updateUserPw,
  createUser,
  addOrder,
  addToCart,
  removeFromCart,
  updateCart,
  getOrdersByIdAndDates,
  updateName,
  getTopBuyer,
} = require("../services/user");

module.exports = {
  signup: async (req, res) => {
    try {
      const { username, password, name } = req.body;
      const newUser = await createUser({ username, password, name });
      res.json(newUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const loggedIn = await login(username, password);
      res.json(loggedIn);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  addToCart: async (req, res) => {
    try {
      const userId = req.body.userId;
      const qty = req.body.qty;
      const productId = req.params.productId;

      const updatedUser = await addToCart(userId, productId, qty);
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  removeFromCart: async (req, res) => {
    try {
      const userId = req.body.userId;
      const productId = req.params.productId;
      const updatedUser = await removeFromCart(userId, productId);
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateCart: async (req, res) => {
    try {
      const userId = req.body.userId;
      const cart = req.body.cart;
      const updatedUser = await updateCart(userId, cart);
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  addOrder: async (req, res) => {
    try {
      const userId = req.body.userId;
      const orderId = req.params.orderId;
      console.log(userId, orderId);
      const updatedUser = await addOrder(userId, orderId);
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getOrdersByIdAndDates: async (req, res) => {
    try {
      const userId = req.params.userId;
      const start = req.params.start;
      const end = req.params.end;
      const orders = await getOrdersByIdAndDates(userId, start, end);
      res.json(orders);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateName: async (req, res) => {
    try {
      const userId = req.body.userId;
      const name = req.body.name;
      const updatedUser = await updateName(userId, name);
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateUserPw: async (req, res) => {
    try {
      const userId = req.body.userId;
      const oldPw = req.body.oldPw;
      const newPw = req.body.newPw;
      const updatedUser = await updateUserPw(userId, oldPw, newPw);
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  TopBuyer: async (req, res) => {
    try {
      const topBuyer = await getTopBuyer();
      res.json(topBuyer);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
