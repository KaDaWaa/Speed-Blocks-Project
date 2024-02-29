const User = require("../models/user");
const bcrypt = require("bcrypt");
const { getOrderById } = require("./order");
const { ObjectId } = require("mongodb");
const { enoughToSupply } = require("./product");

module.exports = {
  createUser: async (user) => {
    console.log(user);
    if (!user.username || !user.password || !user.name)
      return "missing required fields";
    if ((await User.findOne({ username: user.username })) != null)
      return "user already exist";

    const newUser = new User({
      username: user.username,
      password: await bcrypt.hash(
        `${user.password}${process.env.SECRET_KEY}`,
        10
      ),
      name: user.name,
      orders: [],
    });
    return newUser.save();
  },
  updateUserPw: async (userId, oldPw, newPw) => {
    const user = await User.findById(userId);
    if (
      await bcrypt.compare(`${oldPw}${process.env.SECRET_KEY}`, user.password)
    ) {
      user.password = await bcrypt.hash(
        `${newPw}${process.env.SECRET_KEY}`,
        10
      );
      return user.save();
    }
    return "old password is not correct";
  },
  login: async (username, password) => {
    const user = await User.findOne({ username: username });

    if (!user) {
      return "username is incorrect";
    }

    if (
      await bcrypt.compare(
        `${password}${process.env.SECRET_KEY}`,
        user.password
      )
    ) {
      return user;
    } else {
      return "password is incorrect";
    }
  },
  addOrder: async (userId, orderId) => {
    const user = await User.findById(userId);
    if (user) {
      user.orders.push(orderId);
      const updatedUser = await user.save();
      return updatedUser;
    }
    return "User not found";
  },
  addToCart: async (userId, productId, qty) => {
    const user = await User.findById(userId);
    if (user) {
      if (user.cart.some((item) => item.productId == productId)) {
        for (const item of user.cart) {
          if (item.productId == productId) {
            if (await enoughToSupply(item.productId, item.qty + qty)) {
              item.qty += qty;
            } else return "Not enough in stock";
          }
        }
      } else {
        if (await enoughToSupply(productId, qty)) {
          user.cart.push({ productId: productId, qty: qty });
        } else return "Not enough in stock";
      }
      const updatedUser = await user.save();
      return updatedUser;
    }
    return "User not found";
  },
  removeFromCart: async (userId, prodId) => {
    const user = await User.findById(userId);
    if (user) {
      if (user.cart.some((item) => item.productId == prodId)) {
        user.cart = user.cart.filter((item) => item.productId != prodId);
        const updatedUser = await user.save();
        return updatedUser;
      }
      return "Product not found in cart";
    }
    return "User not found";
  },
  getOrdersByIdAndDates: async (userId, start, end) => {
    try {
      const userOrders = await User.aggregate([
        {
          $unwind:
            /**
             * path: Path to the array field.
             * includeArrayIndex: Optional name for index.
             * preserveNullAndEmptyArrays: Optional
             *   toggle to unwind null and empty values.
             */
            {
              path: "$orders",
              includeArrayIndex: "string",
              preserveNullAndEmptyArrays: false,
            },
        },
        {
          $lookup:
            /**
             * from: The target collection.
             * localField: The local join field.
             * foreignField: The target join field.
             * as: The name for the results.
             * pipeline: Optional pipeline to run on the foreign collection.
             * let: Optional variables to use in the pipeline field stages.
             */
            {
              from: "orders",
              localField: "orders",
              foreignField: "_id",
              as: "order",
            },
        },
        {
          $unwind:
            /**
             * path: Path to the array field.
             * includeArrayIndex: Optional name for index.
             * preserveNullAndEmptyArrays: Optional
             *   toggle to unwind null and empty values.
             */
            {
              path: "$order",
              includeArrayIndex: "string",
              preserveNullAndEmptyArrays: false,
            },
        },
        {
          $sort:
            /**
             * Provide any number of field/order pairs.
             */
            {
              "order.createdAt": -1,
            },
        },
        {
          $match:
            /**
             * query: The query in MQL.
             */
            {
              "order.createdAt": {
                $gte: new Date(Number(start)),
                $lte: new Date(Number(end)),
              },
            },
        },
        {
          $group:
            /**
             * _id: The id of the group.
             * fieldN: The first field name.
             */
            {
              _id: "$_id",
              orders: {
                $push: "$order",
              },
            },
        },
        {
          $match:
            /**
             * query: The query in MQL.
             */
            {
              _id: new ObjectId(userId),
            },
        },
      ]);
      if (userOrders.length > 0) {
        return userOrders[0].orders;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error:", error);
      return "An error occurred while fetching orders.";
    }
  },
  updateCart: async (userId, cart) => {
    const user = await User.findById(userId);
    if (user) {
      user.cart = cart;
      return user.save();
    }
    return "User not found";
  },
  updateName: async (userId, newName) => {
    const user = await User.findByIdAndUpdate(userId, { name: newName });
    return user;
  },
  getTopBuyer: async () => {
    return User.aggregate([
      {
        $unwind:
          /**
           * path: Path to the array field.
           * includeArrayIndex: Optional name for index.
           * preserveNullAndEmptyArrays: Optional
           *   toggle to unwind null and empty values.
           */
          {
            path: "$orders",
            includeArrayIndex: "string",
            preserveNullAndEmptyArrays: false,
          },
      },
      {
        $lookup:
          /**
           * from: The target collection.
           * localField: The local join field.
           * foreignField: The target join field.
           * as: The name for the results.
           * pipeline: Optional pipeline to run on the foreign collection.
           * let: Optional variables to use in the pipeline field stages.
           */
          {
            from: "orders",
            localField: "orders",
            foreignField: "_id",
            as: "order",
          },
      },
      {
        $unwind:
          /**
           * path: Path to the array field.
           * includeArrayIndex: Optional name for index.
           * preserveNullAndEmptyArrays: Optional
           *   toggle to unwind null and empty values.
           */
          {
            path: "$order",
            includeArrayIndex: "string",
            preserveNullAndEmptyArrays: false,
          },
      },
      {
        $group:
          /**
           * _id: The id of the group.
           * fieldN: The first field name.
           */
          {
            _id: "$_id",
            totalPurchases: {
              $sum: "$order.totalPrice",
            },
          },
      },
      {
        $sort:
          /**
           * Provide any number of field/order pairs.
           */
          {
            totalPurchases: -1,
          },
      },
      {
        $limit:
          /**
           * Provide the number of documents to limit.
           */
          1,
      },
    ]);
  },
};
