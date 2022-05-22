const AppError = require("../utils/appError");


async function isAdmin(req, res, next) {
    if (req.user.role === "admin") {
        return next();
    }
    return next(new AppError("You are not authorized to perform this action", 403));
}
module.exports = isAdmin;