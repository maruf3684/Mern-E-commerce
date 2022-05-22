const dotenv = require("dotenv");
dotenv.config({ path: "backend/config/config.env" });

const express = require("express");
const app = express();

const dbConnect = require("./config/database");
dbConnect();

//middlewere
const morgan = require("morgan");
const path = require("path");
app.use(morgan("tiny"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.set('view engine', 'ejs');
const dir=path.join(__dirname, "public");
app.use(express.static(dir));


const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const productRouter = require("./routes/productRoute");
const categoryRouter = require("./routes/categoryRoute");
const userRouter = require("./routes/userRoute");
const authRouter = require("./routes/authRoute");
const orderRouter = require("./routes/orderRoute");

//Router
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/orders", orderRouter);


//not found // error object ke is_operational propeerty true kore dibe
app.use("*", (req, res, next) => {
	const error = new AppError("Requested Url Not found / last middlewere", 404);
	error.status = 404;
	next(error);
});

app.use(globalErrorHandler);

module.exports = app;
