
let express = require("express");
let orderRouter = express.Router();
const orderController = require("../controllers/orderController");



orderRouter.route("/").post(orderController.createOrder);
orderRouter.route("/").get(orderController.getAllOrder);
orderRouter.route("/:orderId").get(orderController.getOneOrder);
orderRouter.route("/:orderId").patch(orderController.updateOrder);
orderRouter.route("/:orderId").delete(orderController.deleteOrder);

orderRouter.route("/:userId/order").get(orderController.getAllOrderByUser);


module.exports = orderRouter;