const { json } = require("express/lib/response");

class ApiFeatures {
	constructor(query, params) {
		this.query = query;
		this.params = params;
	}

	search() {
		let innerObject = {};
		if (this.params.keyword) {
			innerObject = {
				name: {
					$regex: this.params.keyword,
					$options: "i",
				},
			};
		} else {
			innerObject = {};
		}
		this.query = this.query.find(innerObject);
		return this;
	}

	sort() {
		if (this.params.sort) {
			const sortBy = this.params.sort.split(",").join(" ");
			this.query = this.query.sort(sortBy);
			console.log(sortBy);
		} else {
			this.query = this.query.sort("-createdAt");
		}
		return this;
	}

	limitFields() {
		if (this.params.fields) {
			const fields = this.params.fields.split(",").join(" ");
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select("-__v");
		}

		return this;
	}

	filter() {
		const queryObj = { ...this.params };
		console.log("1", queryObj);
		const excludedFields = ["page", "sort", "limit", "fields", "keyword"];
		excludedFields.forEach((el) => delete queryObj[el]);
		console.log("2", queryObj);

		let queryStr = JSON.stringify(queryObj);
		console.log("3", queryStr);

		queryStr = queryStr.replaceAll(
			/\b(gte|gt|lte|lt)\b/g,
			(match) => `$${match}`
		);
		console.log("4", queryStr);
		this.query = this.query.find(JSON.parse(queryStr));
		console.log("5", JSON.parse(queryStr));
		//{ price: { '$gt': '200', '$lt': '1000' } }
		return this;
	}

	paginate(resultPerPage) {
		const page = this.params.page * 1 || 1;
		const skip = (page - 1) * resultPerPage;
		this.query = this.query.skip(skip).limit(resultPerPage);
		return this;
	}
}

module.exports = ApiFeatures;
