const controller = require("../controllers/user");
const router = require("express").Router();
const cacheNoStore = require("../middlewares/cacheNoStore");

router.post("/signup", cacheNoStore, controller.signup);
router.post("/login", cacheNoStore, controller.login);
router.post("/addToCart/:productId", cacheNoStore, controller.addToCart);
router.delete(
  "/removeFromCart/:productId",
  cacheNoStore,
  controller.removeFromCart
);
router.put("/updateCart", cacheNoStore, controller.updateCart);
router.put("/addOrder/:orderId", cacheNoStore, controller.addOrder);
router.get(
  "/getOrdersByIdAndDates/:userId/:start/:end",
  cacheNoStore,
  controller.getOrdersByIdAndDates
);
router.put("/updateName", cacheNoStore, controller.updateName);
router.put("/updatePassword", cacheNoStore, controller.updateUserPw);
router.get("/getTopBuyer", cacheNoStore, controller.TopBuyer);

module.exports = router;
