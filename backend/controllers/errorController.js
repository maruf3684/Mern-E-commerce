const errorController = (err, req, res, next) => {
	// console.log("====================================");
	// console.log(err);
	// console.log("====================================");
    console.log("Comming to error controller");
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "unknown error";
    err.message = err.message || "unknown error messsage";
	errrorInDevelopment(err, req, res);
};

const errrorInDevelopment = (err, req, res) => {
	return res.status(err.statusCode).json({
		success: false,
		actualError: err,
		status: err.status,
		message: err.message,
		stack: err.stack,
	});
};

module.exports = errorController;
