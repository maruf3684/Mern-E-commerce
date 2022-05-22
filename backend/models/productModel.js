const mongoose = require("mongoose");
const reviewModel = require("./reviewModel");

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Product name is required"],
			minlength: [3, "Product name must be at least 3 characters long"],
			maxlength: [50, "Product name must be less than 50 characters long"],
			trim: true,
		},
		description: {
			type: String,
			required: [true, "Product description is required"],
			minlength: [5, "Product description must be at least 5 characters long"],
			maxlength: [
				200,
				"Product description must be less than 200 characters long",
			],
			trim: true,
		},
		price: {
			type: Number,
			required: [true, "Product price is required"],
			min: [0, "Product price must be greater than 0"],
			max: [10000000, "Product price must be less than 1000000"],
		},
		avgRating: {
			type: Number,
			default: 0,
			min: [0, "Product rating must be start from 0"],
			max: [5, "Product rating must be less than 5"],
			///set: val => Math.round(val * 10) / 10
		},
		images: {
			type: [
				{
					type: String,
					required: true,
					default: "default.png",
					maxlength: [
						200,
						"Product imageName must be less than 200 characters long",
					],
				},
			],

			validate: {
				validator: function (arr) {
					return arr.length <= 5;
				},
				message: "More than 5 image not allowed",
			},
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			select: false,
		},
		stock: {
			type: Number,
			required: [true, "Product stock is required"],
			min: [0, "Product stock must be greater than 0"],
			max: [1000000, "Product stock must be less than 1000000"],
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

//populate parant referenced virtuals
productSchema.virtual("reviews", {
	ref: "Review",
	foreignField: "product",
	localField: "_id",
});

//product delete hole review o thakbe na
productSchema.post("remove", async function (doc) {
	await reviewModel.deleteMany({ product: doc._id });
});

const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
