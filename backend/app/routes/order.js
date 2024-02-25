const order = require("../controllers/order");
const router = require("express").Router();
const cacheNoStore = require("../middlewares/cacheNoStore");

router.post("/create", cacheNoStore, order.create);
router.get("/getOrderById/:id", cacheNoStore, order.getById);
router.put("/updateOrder/:id", cacheNoStore, order.updateOrder);
router.delete("/deleteOrder/:id", cacheNoStore, order.deleteOrder);
router.get("/amountOfOrders", cacheNoStore, order.amountOfOrders);

module.exports = router;
