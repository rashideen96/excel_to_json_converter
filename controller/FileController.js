const fs = require('fs');
const path = require('path');
const json_file = require('jsonfile');
const convxlsxjson = require('convert-excel-to-json');

// make some promise so we can chained it!
const convert_excel_to_json = (file) => {
	return new Promise((resolve, reject) => {
		try {
			const cv = convxlsxjson({
				sourceFile: file,
				header: {
					rows: 1
				}
			});
			resolve(cv);
		} catch (err) {
			reject(err);
		}
	});
};

// Delete function
const remove_file = (file) => {
	return new Promise((resolve, reject) => {
		try {
			fs.unlinkSync(file);
			resolve('File deleted');
		} catch (err) {
			reject(err);
		}
	});
};

exports.upload = async (req, res, next) => {
	if (!req.file) {
		res.send('File is required');
	}

	try {
		const object_data = await convert_excel_to_json(req.file.path);
		await json_file.writeFile('./json/data.json', object_data, { spaces: 2 });
		const read_file = await json_file.readFile('./json/data.json');

		res.status(200).json({ data: read_file });
		const rm_res = await remove_file(req.file.path);
		console.log(rm_res);
	} catch (err) {
		console.log(err.message);
	}

	

	// convert_excel_to_json(req.file.path)
	// 	.then((result) => {
			
	// 		return json_file.writeFile('./json/data.json', result, { spaces: 2 });
	// 	})
	// 	.then((result) => {
	// 		console.log(result);
	// 		return remove_file(req.file.path);
	// 	})
	// 	.then((result) => {
	// 		console.log(result);
	// 	})
	// 	.catch((err) => {
	// 		console.log(err);
	// 	});
};

exports.index = (req, res, next) => {
	res.sendFile(path.join(__dirname, '../views', 'index.html'));
};

exports.getData = async (req, res, next) => {

	try {
		const result = await json_file.readFile('./json/data.json');
		res.status(200).json({ data: result });
	} catch (err) {
		console.log(err)
	}
	// json_file.readFile('./json/data.json', (err, data) => {
	// 	if (err) throw err;
	// 	res.status(200).json({ data: data });
	// });
};
