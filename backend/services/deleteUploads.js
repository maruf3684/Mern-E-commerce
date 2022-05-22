const { path } = require("express/lib/application");
var fs = require("fs");
const { promisify } = require("util");


async function deleteUploades(paths) {
	const deleteFile = promisify(fs.unlink);
	paths.forEach(async (currentPath) => {
		try {
			await deleteFile(currentPath);
		} catch (err) {
			console.log(err);
		}
	});
}
module.exports = deleteUploades;
