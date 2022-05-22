const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
	{
		rating: {
			type: Number,
			min: [0, "Product rating must be start from 0"],
			max: [5, "Product rating must be less than 5"],
		},
		comment: {
			type: String,
			required: [true, "Comment is required"],
			minlength: [5, "Comment must be at least 5 characters long"],
			maxlength: [100, "Comment must be less than 100 characters long"],
		},
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: [true, "Product is required"],
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "User is required"],
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
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.pre(/^find/, function (next) {
	//one way to add virtual fields
	this.populate({
		path: "user",
		select: "firstName lastName photo",
	});
	//.populate({
	// 	path: "product",
	// 	select: "name",
	// });
	next();
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
	// this points to current query
	//current query obj er moddhe current doc/data vore delam r nam e.
	console.log("pre");
	this.r = await this.findOne().clone();
	console.log(this.r);

	next();
});

reviewSchema.post("save", function () {
	// this points to current review /mane actual data
	//data.constroctor dela model mane class paoua jai/ar class er sathe static method (getAverageRating)call kora jai
	this.constructor.getAverageRating(this.product);
});

reviewSchema.post(/^findOneAnd/, async function () {
	// this points to current query
	//console.log(this);

	//aibar doc.r dile class pabo and static method call korte parbo
	if (this.r) {
		await this.r.constructor.getAverageRating(this.r.product);
	}
});

reviewSchema.statics.getAverageRating = async function (productId) {
	const obj = await this.aggregate([
		{
			$match: { product: mongoose.Types.ObjectId(productId) },
		},
		{
			$group: {
				_id: "$product",
				averageRating: { $avg: "$rating" },
			},
		},
	]);

	try {
		let data;
		if (obj.length > 0) {
			data = obj[0].averageRating;
		} else {
			data = 0;
		}

		await this.model("Product").findByIdAndUpdate(productId, {
			avgRating: data,
		});
	} catch (err) {
		console.log(err);
	}
};

const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;
