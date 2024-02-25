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
  getProductsByPage: async (pageN) => {
    return Product.find()
      .skip((pageN - 1) * 6)
      .limit(6);
  },
  getProductById: async (id) => {
    return Product.findById(id);
  },
  updateProduct: async (id, product) => {
    return Product.findByIdAndUpdate(id, product, { new: true });
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
};
