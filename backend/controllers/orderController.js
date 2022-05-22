const orderModel = require("../models/orderModel");
const catchAsync = require("../utils/catchAsync");

class orderController {
	static createOrder = catchAsync(async (req, res, next) => {
		const { user, address, products, totalPrice, totalQuantity } = req.body;
		const order = await orderModel.create({
			user,
			address,
			products,
			totalPrice,
			totalQuantity,
		});
		res.status(201).json({
			success: true,
			data: order,
		});
	});

	static getAllOrder = catchAsync(async (req, res, next) => {
		const order = await orderModel.find();

		if (!order) {
			return next(new AppError("No document found with that ID", 404));
		}

		res.status(200).json({
			success: true,
			count: order.length,
			data: order,
		});
	});

	static getAllOrderByUser = catchAsync(async (req, res, next) => {
		let filter = {};
		if (req.params.userId) {
			filter.user = req.params.userId;
		}
		const order = await orderModel.find(filter);

		if (!order) {
			return next(new AppError("No document found with that ID", 404));
		}

		res.status(200).json({
			success: true,
			count: order.length,
			data: order,
		});
	});

	static getOneOrder = catchAsync(async (req, res, next) => {
		const order = await orderModel.findById(req.params.orderId);

		if (!order) {
			return next(new AppError("No document found with that ID", 404));
		}

		res.status(200).json({
			success: true,
			data: order,
		});
	});

	static updateOrder = catchAsync(async (req, res, next) => {
		const order = await orderModel.findByIdAndUpdate(
			req.params.orderId,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);

		if (!order) {
			return next(new AppError("No document found with that ID", 404));
		}

		res.status(200).json({
			success: true,
			data: order,
		});
	});

	static deleteOrder = catchAsync(async (req, res, next) => {
		const order = await orderModel.findByIdAndDelete(req.params.orderId);

		if (!order) {
			return next(new AppError("No document found with that ID", 404));
		}

		res.status(204).json({
			success: true,
		});
	});
}

module.exports = orderController;
