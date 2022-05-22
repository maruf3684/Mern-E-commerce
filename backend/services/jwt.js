const jwt = require("jsonwebtoken");

function generateToken(payload) {
	var token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
	return token;
}

function generateTokenRefresh(payload) {
	var token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_EXPIRES_IN_REFRESH,
	});
	return token;
}

module.exports = { generateToken, generateTokenRefresh };