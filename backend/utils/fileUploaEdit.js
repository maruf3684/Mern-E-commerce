const multer = require("multer");
const path = require("path");
const sharp = require("sharp");

exports.fileUploadEdit = () => {
	const storage = multer.memoryStorage();
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
};

exports.resizeUserphoto = async (req, res, next) => {
	if (!req.files) {
		return next();
	}

	//await Promise.all(
		req.files.map(async (file, index) => {
			const extName = path.extname(file.originalname);
			file.filename =
				file.originalname
					.replace(extName, "")
					.trim()
					.toLowerCase()
					.split(" ")
					.join("-") +
				"-" +
				Math.round(Math.random() * 1e9) +
				Date.now() +
				extName;

			try {
				await sharp(file.buffer)
					.resize(700, 600)
					.toFormat("jpeg")
					.jpeg({ quality: 90 })
					.toFile(
						path.join(__dirname, `../public/uploades/products/${file.filename}`)
					);
			} catch (err) {
				console.log(err);
				req.files.splice(index,1);
			}
		})
	//);

	next();
};
