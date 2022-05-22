const { default: mongoose } = require("mongoose");
const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");
const ApiFeatures = require("../services/apiFeatures");
const catchAsync = require("../utils/catchAsync");

class Categorycontroller {
	static getAllCategoriesProduct = catchAsync(async (req, res, next) => {
		const resultPerPage = 5;
		const apiObject = new ApiFeatures(
			productModel.find({ category: req.params.id }),
			req.query
		);

		//tried agregation
		// const apiObject = categoryModel.aggregate([
		// 	{ $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
		// 	{
		// 		$lookup: {
		// 			from: "products",
		// 			localField: "_id",
		// 			foreignField: "category",
		// 			as: "products",
		// 		},
		// 	},
		// 	{ $project: { products: 1, _id: 0 } },
		// ]);

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

	static createCategory = catchAsync(async (req, res, next) => {
		const category = await categoryModel.create(req.body);
		res.status(201).json({
			success: true,
			data: category,
		});
	});

	static getAllCategories = catchAsync(async (req, res, next) => {
		const categories = await categoryModel.find();
		res.status(200).json({
			success: true,
			count: categories.length,
			data: categories,
		});
	});

	static getCategory = catchAsync(async (req, res, next) => {
		const category = await categoryModel.findById(req.params.id);
		res.status(200).json({
			success: true,
			data: category,
		});
	});

	static updateCategory = catchAsync(async (req, res, next) => {
		const category = await categoryModel.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);
		res.status(200).json({
			success: true,
			data: category,
		});
	});

	static deleteCategory = catchAsync(async (req, res, next) => {
		await categoryModel.findByIdAndDelete(req.params.id);
		res.status(204).json({
			success: true,
			data: null,
		});
	});
}

module.exports = Categorycontroller;
