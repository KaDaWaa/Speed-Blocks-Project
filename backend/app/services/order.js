const Order = require("../models/order");
const Product = require("../models/product");
const { getPrice } = require("./product");

module.exports = {
  createOrder: async (order) => {
    const newOrder = new Order({
      items: order.items,
      totalPrice: order.totalPrice,
    });
    return newOrder.save();
  },
  getOrderById: async (id) => {
    return Order.findById(id);
  },
  updateOrder: async (id, order) => {
    return Order.findByIdAndUpdate(id, order, { new: true });
  },
  deleteOrder: async (id) => {
    return Order.findByIdAndDelete(id);
  },
  amountOfOrders: async () => {
    return Order.countDocuments();
  },
  getTotalPrice: async (items) => {
    let totalPrice = 0;
    for (const item of items) {
      console.log(item.productId, item.qty);
      const price = await getPrice(item.productId);
      totalPrice += price * item.qty;
    }
    return totalPrice;
  },
  top3BestSelling: async () => {
    return Order.aggregate([
      {
        $unwind:
          /**
           * path: Path to the array field.
           * includeArrayIndex: Optional name for index.
           * preserveNullAndEmptyArrays: Optional
           *   toggle to unwind null and empty values.
           */
          {
            path: "$items",
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
            _id: "$items.productId",
            total: {
              $sum: "$items.qty",
            },
          },
      },
      {
        $sort:
          /**
           * Provide any number of field/order pairs.
           */
          {
            total: -1,
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
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
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
            path: "$product",
            includeArrayIndex: "string",
            preserveNullAndEmptyArrays: false,
          },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$product",
              {
                total: "$total",
              },
            ],
          },
        },
      },
      {
        $limit:
          /**
           * Provide the number of documents to limit.
           */
          3,
      },
    ]);
  },
};
