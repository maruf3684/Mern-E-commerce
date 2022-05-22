const multer = require("multer");
const path = require("path");


function fileUpload(folder) {
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, path.join(__dirname, `../public/uploades/${folder}`));
		},
		filename: function (req, file, cb) {
			const extName = path.extname(file.originalname);
			const justFileName =
				file.originalname
					.replace(extName, "")
					.trim()
					.toLowerCase()
					.split(" ")
					.join("-") +
				"-" +
				Math.round(Math.random() * 1e9) +
				Date.now();
			cb(null, justFileName + extName);
		},
	});

	const upload = multer({
		storage: storage,
		limits: {
			fileSize: 1000000,
		},
		fileFilter: function (req, file, cb) {
			if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
				cb(null, true);
			} else {
				cb(new Error("only jpeg and png are allowed"), false);
			}
		},
	});

	return upload;
}

module.exports = fileUpload;
