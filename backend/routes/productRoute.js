let express = require("express");
let productRouter = express.Router();
const Productcontroller = require("../controllers/productController");
const isAuthenticated = require("../middlewere/isAuthenticated");
const fileUpload = require("../utils/fileUpload");
const { fileUploadEdit, resizeUserphoto } = require("../utils/fileUploaEdit");
const reviewRouter = require("./reviewRoute");


productRouter.use("/:productId/reviews", reviewRouter);

productRouter.post(
	"/",
	fileUploadEdit().array("products", 2),
	resizeUserphoto,
	Productcontroller.createProduct
);

productRouter.get("/", Productcontroller.getAllProducts);
productRouter.get("/:productId", Productcontroller.getProductById);
productRouter.patch(
	"/:productId",
	fileUploadEdit().array("products", 2),
	resizeUserphoto,
	Productcontroller.updateProduct
);
productRouter.delete("/:productId", Productcontroller.deleteProduct);

module.exports = productRouter;
