var express = require("express");
var userRouter = express.Router();
const userController = require("../controllers/userController");
const fileUpload = require("../utils/fileUpload");
const isAuthenticated = require("../middlewere/isAuthenticated");
const isAdmin = require("../middlewere/isAdmin");
const addressRouter = require("./addressRouter");
const orderRouter = require("./orderRoute");


userRouter.use("/:userId/address", addressRouter);




userRouter.get("/",isAuthenticated, userController.getAllUsers);
userRouter.get("/:id", userController.getUser);
userRouter.delete("/:id", userController.deleteUser);

module.exports = userRouter;
