const reviewModel = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
class ReviewController {
	static createReview = catchAsync(async (req, res, next) => {
		if (!req.body.product) {
			req.body.product = req.params.productId;
		}
		req.body.user = req.user._id;
		const { rating, comment, product, user } = req.body;
		const review = await reviewModel.create({ rating, comment, product, user });

		res.status(201).json({
			success: true,
			data: review,
		});
	});

	static getAllReviews = catchAsync(async (req, res, next) => {
		let filter = {};
		if (req.params.productId) {
			filter.product = req.params.productId;
		}
		const reviews = await reviewModel.find(filter);



		res.status(200).json({
			success: true,
			count: reviews.length,
			data: reviews,
		});
	});

	static getReview = catchAsync(async (req, res, next) => {
		const review = await reviewModel.findById(req.params.reviewId);
		if (!review) {
			return next(new AppError("No document found with that ID", 404));
		}
		res.status(200).json({
			success: true,
			data: review,
		});
	});

	static updateReview = catchAsync(async (req, res, next) => {
		const review = await reviewModel.findByIdAndUpdate(
			req.params.reviewId,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		).clone();

		if (!review) {
			return next(new AppError("No document found with that ID", 404));
		}

		res.status(200).json({
			success: true,
			data: review,
		});
	});

	static deleteReview = catchAsync(async (req, res, next) => {
		let doc = await reviewModel.findByIdAndDelete(req.params.reviewId);

		if (!doc) {
			return next(new AppError("No document found with that ID del", 404));
		}
		return res.status(200).json({
			success: true,
			data: null,
		});
	});
}
module.exports = ReviewController;
