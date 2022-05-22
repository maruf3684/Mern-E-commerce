const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
	{
		shippingAddress: {
			type: String,
			required: [true, "Shipping Address is required"],
			trim: true,
			minlength: [5, "Shipping Address must be at least 5 characters long"],
			maxlength: [
				500,
				"Shipping Address must be less than 500 characters long",
			],
		},
		billingAddress: {
			type: String,
			required: [true, "Billing Address is required"],
			trim: true,
			minlength: [5, "Billing Address must be at least 5 characters long"],
			maxlength: [500, "Billing Address must be less than 500 characters long"],
		},
		phoneNumber: {
			type: String,
			required: [true, "Phone Number is required"],
			trim: true,
			validate: {
				validator: function (v) {
					var reg = new RegExp("^[0-9]*$");
					return reg.test(v);
				},
				message: "Phone Number must be numeric",
			},
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

const addressModel = mongoose.model("Address", addressSchema);
module.exports = addressModel;
