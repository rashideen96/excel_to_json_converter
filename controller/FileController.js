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

exports.upload = (req, res, next) => {
	if (!req.file) {
		res.send('File is required');
	}

	convert_excel_to_json(req.file.path)
		.then((result) => {
			res.status(200).json({ data: result });
			return json_file.writeFile('./json/data.json', result, { spaces: 2 });
		})
		.then((result) => {
			console.log(result);
			return remove_file(req.file.path);
		})
		.then((result) => {
			console.log(result);
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.index = (req, res, next) => {
	res.sendFile(path.join(__dirname, '../views', 'index.html'));
};

exports.getData = (req, res, next) => {
	json_file.readFile('./json/data.json', (err, data) => {
		if (err) throw err;
		res.status(200).json({ data: data });
	});
};
