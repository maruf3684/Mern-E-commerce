const addressModel = require("../models/addressModel");
const catchAsync = require("../utils/catchAsync");

class addressController {
	static createAddress = catchAsync(async (req, res, next) => {
		const { shippingAddress, billingAddress, phoneNumber } = req.body;
		const address = await addressModel.create({
			shippingAddress,
			billingAddress,
			phoneNumber,
		});
		res.status(201).json({
			success: true,
			data: address,
		});
	});

	static getAllAddress = catchAsync(async (req, res, next) => {
		let filter = {};
		if (req.params.userId) {
			filter.user = req.params.userId;
		}
		const address = await addressModel.find(filter);

        if (!address) {
			return next(new AppError("No document found with that ID", 404));
		}

		res.status(200).json({
			success: true,
			count: address.length,
			data: address,
		});
	});

	static getAddress = catchAsync(async (req, res, next) => {
		const address = await addressModel.findById(req.params.addressId);
		if (!address) {
			return next(new AppError("No document found with that ID", 404));
		}
		res.status(200).json({
			success: true,
			data: address,
		});
	});

	static updateAddress = catchAsync(async (req, res, next) => {
		const address = await addressModel.findByIdAndUpdate(
			req.params.addressId,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);

		if (!address) {
			return next(new AppError("No document found with that ID", 404));
		}

		res.status(200).json({
			success: true,
			data: address,
		});
	});

	static deleteAddress = catchAsync(async (req, res, next) => {
		const address = await addressModel.findByIdAndDelete(req.params.addressId);
		if (!address) {
			return next(new AppError("No document found with that ID", 404));
		}
		res.status(204).json({
			success: true,
			data: null,
		});
	});
}

module.exports = addressController;
