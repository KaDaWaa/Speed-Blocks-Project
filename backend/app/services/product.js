const Product = require("../models/product");
module.exports = {
  createProduct: async (product) => {
    if (
      !product.name ||
      product.price == NaN ||
      !product.description ||
      !product.img ||
      product.inStock == NaN
    ) {
      return "missing required fields";
    }
    const newProduct = new Product({
      name: product.name,
      price: product.price,
      description: product.description,
      img: product.img,
      inStock: product.inStock,
    });
    return newProduct.save();
  },
  getPrice: async (id) => {
    const product = await Product.findById(id);
    if (!product) {
      return "Product not found";
    }
    return product.price;
  },

  getProductById: async (id) => {
    return Product.findById(id);
  },
  updateProduct: async (id, product) => {
    return Product.findByIdAndUpdate(
      id,
      { ...product, updatedAt: Date.now() },
      { new: true }
    );
  },
  deleteProduct: async (id) => {
    return Product.findByIdAndDelete(id);
  },
  enoughToSupply: async (id, quantity) => {
    const product = await Product.findById(id);
    if (!product) {
      return "Product not found";
    } else if (product.inStock < quantity) {
      return false;
    }
    return true;
  },
  updateProductQuantity: async (id, quantity) => {
    const product = await Product.findById(id);
    if (!product) {
      return "Product not found";
    }
    product.inStock -= quantity;
    return product.save();
  },
  amountOfProducts: async () => {
    return Product.countDocuments();
  },
  getProductsByPageAndSort: async (pageN, sortBy) => {
    return Product.find()
      .sort(sortBy)
      .skip((pageN - 1) * 6)
      .limit(6);
  },
  getProductsByPage: async (pageN) => {
    return Product.find()
      .skip((pageN - 1) * 6)
      .limit(6);
  },
  bestSellingByPage: async (pageN) => {
    return Product.aggregate([
      // להביא את כל המוצרים
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      // להפריד את המוצרים למוצרים נפרדים
      {
        $unwind: "$product",
      },
      // לחשב את כמות המוצרים שנמכרה לכל מוצר
      {
        $lookup: {
          from: "orders",
          let: {
            productId: "$_id",
          },
          pipeline: [
            {
              $unwind: "$items",
            },
            {
              $match: {
                $expr: {
                  $eq: ["$items.productId", "$$productId"],
                },
              },
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum: "$items.qty",
                },
              },
            },
          ],
          as: "sales",
        },
      },
      // להציג את המוצרים עם כמות המוצרים שנמכרה
      {
        $project: {
          _id: "$product._id",
          name: "$product.name",
          img: "$product.img",
          description: "$product.description",
          price: "$product.price",
          inStock: "$product.inStock",
          createdAt: "$product.createdAt",
          updatedAt: "$product.updatedAt",
          total: {
            $ifNull: [
              {
                $arrayElemAt: ["$sales.total", 0],
              },
              0,
            ],
          },
        },
      },
      // לסדר את המוצרים לפי כמות המוצרים שנמכרה בסדר יורד
      {
        $sort: {
          total: -1,
        },
      },
      {
        $skip:
          /**
           * Provide the number of documents to skip.
           */
          (pageN - 1) * 6,
      },
      {
        $limit:
          /**
           * Provide the number of documents to limit.
           */
          6,
      },
    ]);
  },
};
