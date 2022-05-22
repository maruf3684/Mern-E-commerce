var express = require("express");
var categoryRouter = express.Router();
const Categorycontroller = require("../controllers/categoryController");

categoryRouter.route("/")
.get(Categorycontroller.getAllCategories)
.post(Categorycontroller.createCategory);

categoryRouter.route("/:id")
.get(Categorycontroller.getAllCategoriesProduct)
.patch(Categorycontroller.updateCategory)
.delete(Categorycontroller.deleteCategory);

module.exports = categoryRouter;