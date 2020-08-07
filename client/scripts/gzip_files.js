const zlib = require('zlib');

const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV;

fs.readdir(path.resolve(__dirname, './../'+ env), (err, files) => {
	let list = files.filter((name) => {
		return !/\.gz/.test(name) && /\.(js|html|css)/.test(name);
	});

	list.forEach((name) => {
		const gzip = zlib.createGzip();
		let filePath = path.resolve(__dirname, './../'+ env, name);

		let inp = fs.createReadStream(filePath);
		let out = fs.createWriteStream(filePath + '.gz');

		inp.pipe(gzip).pipe(out);
	});
});
