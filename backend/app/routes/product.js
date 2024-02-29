const product = require("../controllers/product");
const router = require("express").Router();
const cacheNoStore = require("../middlewares/cacheNoStore");

router.post("/create", cacheNoStore, product.create);
router.get(
  "/getProductsByPageAndSort/:pageN/:sortBy",
  cacheNoStore,
  product.getAllByPageAndSort
);
router.get("/getById/:id", cacheNoStore, product.getById);
router.put("/editProduct/:id", cacheNoStore, product.editProduct);
router.delete("/deleteProduct/:id", cacheNoStore, product.deleteProduct);
router.put("/updateProductQuantity/:id", cacheNoStore, product.updateQuantity);
router.get("/getTotalProducts", cacheNoStore, product.totalProducts);
router.get("/top3BestSelling", cacheNoStore, product.top3Products);

module.exports = router;
