function catchAsync(fn) {
	return (req, res, next) => {
		//function call kore error ashle tar sathe .catch laganao jai
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}

module.exports = catchAsync;
