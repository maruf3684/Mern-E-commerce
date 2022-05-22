const productModel = require("../models/productModel");
const AppError = require("../utils/appError");
const deleteUploades = require("../services/deleteUploads");
const path = require("path");
const catchAsync = require("../utils/catchAsync");
const ApiFeatures = require("../services/apiFeatures");
const Email = require("../utils/email");

class Productcontroller {
	static createProduct = catchAsync(async (req, res, next) => {
		if (
			req.body.name &&
			req.body.description &&
			req.body.price &&
			req.body.category &&
			req.body.user &&
			req.files.length > 0
		) {
			const newObject = {};
			newObject.avgRating = req.body.avgRating;
			newObject.name = req.body.name;
			newObject.description = req.body.description;
			newObject.price = req.body.price;
			newObject.category = req.body.category;
			newObject.user = req.body.user;
			newObject.images = req.files.map((image) => image.filename);

			const product = await productModel.create(newObject);
			await product.save();
			res.status(201).json({
				status: "success",
				data: product,
			});
		} else {
			if (req.files.length > 0) {
				const paths = req.files.map((imageObj) =>
					path.join(
						__dirname,
						`../public/uploades/products/${imageObj.filename}`
					)
				);
				await deleteUploades(paths);
			}
			next(new AppError("Please provide all the required fields", 400));
		}
	});

	static getAllProducts = catchAsync(async (req, res, next) => {
		const resultPerPage = 5;
		const apiObject = new ApiFeatures(productModel.find(), req.query);
		await apiObject
			.search()
			.sort()
			.filter()
			.limitFields()
			.paginate(resultPerPage);
		const products = await apiObject.query;

		res.status(200).json({
			status: "success",
			results: products.length,
			data: products,
		});
	});

	static getProductById = catchAsync(async (req, res, next) => {
		const product = await productModel
			.findById(req.params.productId)
			.populate("reviews");
		if (!product) {
			return next(new AppError("Product not found", 404));
		}
		res.status(200).json({
			status: "success",
			data: product,
		});
	});

	static updateProduct = catchAsync(async (req, res, next) => {
		let product = await productModel.findById(req.params.productId);

		if (!product) {
			return next(new AppError("Product not found", 404));
		}

		if (req.files.length > 0) {
			const paths = product.images.map((image) =>
				path.join(__dirname, `../public/uploades/products/${image}`)
			);
			await deleteUploades(paths);
			req.body.images = req.files.map((image) => image.filename);
		}
		product = await productModel.findByIdAndUpdate(
			req.params.productId,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);

		res.status(200).json({
			status: "success",
			data: product,
		});
	});

	static deleteProduct = catchAsync(async (req, res, next) => {
		const product = await productModel.findById(req.params.productId);
		if (!product) {
			next(new AppError("Product not found", 404));
		}

		const paths = product.images.map((image) =>
			path.join(__dirname, `../public/uploades/products/${image}`)
		);
		await product.remove();
		await deleteUploades(paths);

		res.status(200).json({
			status: "success",
			data: {},
		});
	});
}

module.exports = Productcontroller;
