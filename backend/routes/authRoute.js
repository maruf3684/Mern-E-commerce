var express = require("express");
var authRouter = express.Router();
const authController = require("../controllers/authController");
const isAuthenticated = require("../middlewere/isAuthenticated");
const fileUpload = require("../utils/fileUpload");



authRouter.post("/signup", fileUpload("avaters").single("photo"),authController.signup);
authRouter.get("/login", authController.login);
authRouter.patch("/changepassword", isAuthenticated,authController.changePassword);

authRouter.get("/getaccess", authController.getAccessToken);

authRouter.get("/forgotpassword", authController.forgotPassword );
authRouter.patch("/resetpassword/:token", authController.resetPassword);

module.exports = authRouter;