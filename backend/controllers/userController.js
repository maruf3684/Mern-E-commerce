const catchAsync = require("../utils/catchAsync");
const userModel = require("../models/userModel");
const deleteUploads = require("../services/deleteUploads");
const AppError = require("../utils/appError");
const path=require("path");

class userController {
	static getAllUsers = catchAsync(async (req, res, next) => {
		const users = await userModel.find();
		res.status(200).json({
			success: true,
			data: users,
		});
	});

	static deleteUser = catchAsync(async (req, res, next) => {
		const user = await userModel.findById(req.params.id);
		if (!user) {
			return next(new AppError("No user found with that ID", 404));
		}

		if (user.photo) {
			const link = path.join(
				__dirname,
				`../public/uploades/avaters/${user.photo}`
			);
			deleteUploads([link]);
		}

		await user.remove();
		res.status(200).json({
			success: true,
			data: {},
		});
	})

	static getUser = catchAsync(async (req, res, next) => {
		const user = await userModel.findById(req.params.id).populate("address");
		if (!user) {
			return next(new AppError("No user found with that ID", 404));
		}

		res.status(200).json({
			success: true,
			data: user,
		});
	})
}

module.exports = userController;
