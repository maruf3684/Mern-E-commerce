const mongoose = require("mongoose");
var validator = require("validator");
var bcrypt = require("bcryptjs");
const reviewModel = require("./reviewModel");
const addressModel = require("./addressModel");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			trim: true,
			required: [true, "First name is required"],
			minlength: [3, "First name must be at least 3 characters long"],
			maxlength: [10, "First name must be less than 10 characters long"],
		},
		lastName: {
			type: String,
			trim: true,
			required: [true, "Last name is required"],
			minlength: [3, "Last name must be at least 3 characters long"],
			maxlength: [10, "Last name must be less than 10 characters long"],
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			unique: [true, "Email already exists"],
			required: [true, "Email is required"],
			validate: [validator.isEmail, "invalid email"],
		},
		password: {
			type: String,
			select: false,
			required: [true, "Password is required"],
			minlength: [8, "Password must be at least 8 characters long"],
		},
		passwordConfirm: {
			type: String,
			required: [true, "Please confirm your password"],
			validate: {
				// This only works on CREATE and SAVE!!!
				validator: function (el) {
					return el === this.password;
				},
				message: "Passwords are not the same!",
			},
		},
		passwordChangedAt: {
			type: Date,
		},
		passwordResetToken: {
			type: String,
		},
		passwordResetExpires: {
			type: Date,
		},
		isActive: {
			type: Boolean,
			default: true,
			select: false,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		photo: {
			type: String,
			default: "default.jpg",
		},
		address: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Address",
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

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

userSchema.pre("save", function (next) {
	if (!this.isModified("password") || this.isNew) {
		return next();
	}

	this.passwordChangedAt = Date.now() - 2000;
	next();
});

userSchema.pre(/^find/, function (next) {
	this.populate({
		path: "address",
		select: "shippingAddress billingAddress phoneNumber createdAt",
	});
	next();
});

//user delete hole review o thakbe na
userSchema.post("remove", async function (doc) {
	await reviewModel.deleteMany({ product: doc._id });
	await addressModel.deleteMany({ user: doc._id });
});
userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changedPasswordAfter = async function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);
		const resut = JWTTimestamp < changedTimestamp;
		console.log(
			"Jwt=",
			JWTTimestamp,
			"change=",
			changedTimestamp,
			"result=false mane jwt boro kaj hobe",
			resut
		);
		return resut;
	}
	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString("hex");

	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	console.log({ resetToken }, this.passwordResetToken);

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
