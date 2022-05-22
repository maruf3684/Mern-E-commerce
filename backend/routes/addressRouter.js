
var express = require("express");
var addressRouter = express.Router({ mergeParams: true });
const addressController = require("../controllers/addressController");

addressRouter.route("/").post(addressController.createAddress);
addressRouter.route("/").get(addressController.getAllAddress);
addressRouter.route("/:addressId").get(addressController.getAddress);
addressRouter.route("/:addressId").patch(addressController.updateAddress);
addressRouter.route("/:addressId").delete(addressController.deleteAddress);

module.exports = addressRouter;

