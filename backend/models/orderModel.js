const mongoose = require("mongoose");
const productModel = require("./productModel");

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "User is required"],
		},
		address: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Address",
			required: [true, "Address is required"],
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: [true, "Product is required"],
				},
				quantity: {
					type: Number,
					required: [true, "Quantity is required"],
				},
			},
		],
		totalPrice: {
			type: Number,
			required: [true, "Total is required"],
		},
		totalQuantity: {
			type: Number,
			required: [true, "Total quantity is required"],
		},
		status: {
			type: String,
			enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
			default: "pending",
			required: [true, "Status is required"],
		},
		payment: {
			type: String,
			enum: ["cash", "stripe"],
			default: "cash",
			required: [true, "Payment is required"],
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

orderSchema.pre(/^find/, function (next) {
	this.populate({
		path: "user",
		select: "firstName lastName email photo",
	})
		.populate({
			path: "address",
			select:
				"shippingAddress billingAddress phoneNumber phoneNumber createdAt",
		})
		.populate({
			path: "products",
			select: "product quantity",
		})
		.populate({
			path: "products.product",
			select: "name description price images stock",
		});
	next();
});

orderSchema.post("save", function (doc, next) {
	console.log("order schema post save");
	doc.products.forEach((product) => {
		productModel
			.findByIdAndUpdate(
				product.product,
				{ $inc: { stock: -product.quantity } },
				{ new: true }
			)
			.then((product) => {
				console.log(product);
			})
			.catch((err) => {
				console.log(err);
			});
	});
});

const orderModel = mongoose.model("Order", orderSchema);
module.exports = orderModel;
