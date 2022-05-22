const mongoose = require("mongoose");
const productModel = require("./productModel");

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Category name is required"],
			trim: true,
			lowercase: true,
			unique: [true, "Category name already exists"],
			minlength: [3, "Category name must be at least 3 characters long"],
			maxlength: [50, "Category name must be less than 50 characters long"],
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


categorySchema.virtual("products", {
	ref: "Product",
	foreignField: "category",
	localField: "_id",
});


categorySchema.post("remove", async function (doc) {
	await productModel.deleteMany({ category: doc._id });
});

module.exports = mongoose.model("Category", categorySchema);
