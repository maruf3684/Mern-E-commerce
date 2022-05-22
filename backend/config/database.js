const mongoose = require("mongoose");

async function dbConnect() {
	try {
        console.log("DB Connecting...");
        //console.log(process.env.DB_URI);
		await mongoose.connect(process.env.DB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			//useCreateIndex: true,
		});
        console.log(`DB connected successFully`);
	} catch (error) {
		console.log(error);
	}
}

module.exports = dbConnect;
