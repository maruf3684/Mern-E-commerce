const catchAsync = require("../utils/catchAsync");
const userModel = require("../models/userModel");
const deleteUploads = require("../services/deleteUploads");
const path = require("path");
const AppError = require("../utils/appError");
const { generateToken, generateTokenRefresh } = require("../services/jwt");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Email = require("../utils/email");
const crypto = require('crypto');

class authController {
	static signup = catchAsync(async (req, res, next) => {
		const userObject = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password,
			passwordConfirm: req.body.passwordConfirm,
		};

		if (req.file) {
			userObject.photo = req.file.filename;
		}

		let user;
		try {
			user = await userModel.create(userObject);
			// Remove password from output
			user.password = undefined;
		} catch (err) {
			if (req.file) {
				const link = path.join(
					__dirname,
					`../public/uploades/avaters/${req.file.filename}`
				);
				deleteUploads([link]);
			}

			return next(err);
		}

		res.status(201).json({
			success: true,
			data: user,
		});
	});

	static login = catchAsync(async (req, res, next) => {
		const { email, password } = req.body;
		if (!email || !password) {
			return next(new AppError("Please provide email and password", 400));
		}

		//check user available
		const user = await userModel
			.findOne({ email: req.body.email })
			.select("+password");

		//check password same or not
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return next(new AppError("Incorrect Email Or Password", 401));
		}

		let object = { userId: user._id, email: user.email };
		let accessToken = generateToken(object);
		let refreshToken = generateTokenRefresh(object);

		res.status(200).json({
			success: true,
			accessToken: accessToken,
			refreshToken: refreshToken,
		});
	});

	static getAccessToken = catchAsync(async (req, res, next) => {
		const { refreshToken } = req.body;
		if (!refreshToken) {
			return next(new AppError("Please provide refresh token", 400));
		}

		//grab and decode tocken
		const token = refreshToken;
		let decode;
		try {
			decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
		} catch (err) {
			return next(new AppError("Invalid Refresh Token", 401));
		}

		//check if user exist
		const currentUser = await userModel.findById(decode.userId);
		if (!currentUser) {
			return next(
				new AppError(
					"The user belonging to this token does no longer exist.",
					404
				)
			);
		}

		//check if user changed password after the token was issued/jwt choto hole atke dau

		if ((await currentUser.changedPasswordAfter(decode.iat)) === true) {
			return next(
				new AppError(
					"User recently changed password! Please log in again.",
					401
				)
			);
		}

		let object = { userId: currentUser._id, email: currentUser.email };
		let accessToken = generateToken(object);

		res.status(200).json({
			success: true,
			accessToken: accessToken,
		});
	});

	static changePassword = catchAsync(async (req, res, next) => {
		const { oldpassword, password, passwordConfirm } = req.body;

		if (!password || !passwordConfirm || !oldpassword) {
			return next(
				new AppError(
					"Please provide password and passwordConfirm and currentpassword",
					400
				)
			);
		}

		const user = await userModel.findById(req.user._id).select("+password");

		console.log(user.comparePassword(oldpassword));

		if ((await user.comparePassword(oldpassword)) === false) {
			return next(new AppError("You given Incorrect password", 401));
		}

		user.password = password;
		user.passwordConfirm = passwordConfirm;
		await user.save();

		//generate new token
		let object = { userId: user._id, email: user.email };
		let accessToken = generateToken(object);
		let refreshToken = generateTokenRefresh(object);
		user.password = undefined;

		res.status(200).json({
			success: true,
			accessToken: accessToken,
			refreshToken: refreshToken,
			data: user,
		});
	});

	static forgotPassword = catchAsync(async (req, res, next) => {
		// 1) Get user based on POSTed email
		const user = await userModel.findOne({ email: req.body.email });
		if (!user) {
			return next(new AppError("There is no user with email address.", 404));
		}

		const resetToken = user.createPasswordResetToken();
		await user.save({ validateBeforeSave: false });

		// 3) Send it to user's email
		try {
			const resetURL = `${req.protocol}://${req.get(
				"host"
			)}/api/v1/auth/resetPassword/${resetToken}`;
			await new Email(user, resetURL).sendPasswordReset();

			res.status(200).json({
				status: "success",
				message: "Token sent to email!",
			});
		} catch (err) {
			user.passwordResetToken = undefined;
			user.passwordResetExpires = undefined;
			await user.save({ validateBeforeSave: false });

			return next(
				new AppError("There was an error sending the email. Try again later!"),
				500
			);
		}
	});

	static resetPassword = catchAsync(async (req, res, next) => {
		const hashedToken = crypto
			.createHash("sha256")
			.update(req.params.token)
			.digest("hex");

		const user = await userModel.findOne({
			passwordResetToken: hashedToken,
			passwordResetExpires: { $gt: Date.now() },
		});

		if (!user) {
			return next(new AppError("Token is invalid or has expired", 400));
		}
		user.password = req.body.password;
		user.passwordConfirm = req.body.passwordConfirm;
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save();

		let object = { userId: user._id, email: user.email };
		let accessToken = generateToken(object);
		let refreshToken = generateTokenRefresh(object);

		res.status(200).json({
			success: true,
			accessToken: accessToken,
			refreshToken: refreshToken,
		});
	});
}

module.exports = authController;

//mail sending
// try {
// 	await new Email(req.user, "www.reset.com").sendPasswordReset();
// } catch (err) {
// 	console.log(err);
// }
