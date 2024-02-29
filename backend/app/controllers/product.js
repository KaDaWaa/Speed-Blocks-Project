const {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductQuantity,
  getProductsByPage,
  amountOfProducts,
  getProductsByPageAndSort,
  bestSellingByPage,
} = require("../services/product");

const { top3BestSelling } = require("../services/order");

module.exports = {
  create: async (req, res) => {
    try {
      const product = req.body;
      console.log(product);
      const newProduct = await createProduct(product);
      if (newProduct === "missing required fields") {
        return res.status(400).json("missing required fields");
      }
      res.json(newProduct);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAllByPageAndSort: async (req, res) => {
    try {
      const pageN = req.params.pageN;
      const sortBy = req.params.sortBy;
      let queryOptions = {};

      if (sortBy === "newest") {
        queryOptions = { createdAt: -1 };
      } else if (sortBy === "oldest") {
        queryOptions = { createdAt: 1 };
      } else if (sortBy === "price-asc") {
        queryOptions = { price: 1 };
      } else if (sortBy === "price-desc") {
        queryOptions = { price: -1 };
      }

      let products;
      if (sortBy === "default" || !sortBy) {
        products = await getProductsByPage(pageN);
      } else {
        if (sortBy === "best-selling") {
          products = await bestSellingByPage(pageN);
        } else {
          products = await getProductsByPageAndSort(pageN, queryOptions);
        }
      }

      if (!products || products.length === 0) {
        return res.status(404).json("No products found");
      }
      res.json(products);
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
      const product = await getProductById(id);
      if (!product) {
        return res.status(404).json("Product not found");
      }
      res.json(product);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  editProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const updatedFields = req.body;
      const updatedProduct = await updateProduct(id, updatedFields);
      res.json(updatedProduct);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const deletedProduct = await deleteProduct(id);
      if (!deletedProduct) {
        return res.status(404).json("Product not found");
      }
      res.json(deletedProduct);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateQuantity: async (req, res) => {
    try {
      const id = req.params.id;
      const quantity = req.body.quantity;
      const updatedProduct = await updateProductQuantity(id, quantity);
      if (updatedProduct == "Product not found") {
        return res.status(400).json("Product not found");
      } else if (updatedProduct === "Not enough quantity in stock") {
        return res.status(400).json("Not enough quantity in stock");
      }
      res.json(updatedProduct);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  totalProducts: async (req, res) => {
    try {
      const amount = await amountOfProducts();
      if (!amount) {
        return res.status(400).json("No products found");
      }
      res.json(amount);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  top3Products: async (req, res) => {
    try {
      const top3 = await top3BestSelling();
      if (!top3) {
        return res.status(400).json("No products found");
      }
      res.json(top3);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
