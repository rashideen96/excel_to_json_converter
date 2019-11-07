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
		const obj_key = Object.keys(read_file);
		const return_data = obj_key.map((key, i) => {
			return {
				tablename: key,
				table: read_file[key],
				total: read_file[key].length
			}
		})

		res.status(200).json({ data: return_data });
		await json_file.writeFile('./json/data1.json', return_data, { spaces: 2 });
		const rm_res = await remove_file(req.file.path);
		console.log(rm_res);
	} catch (err) {
		console.log(err.message);
	}

};

exports.index = (req, res, next) => {
	res.sendFile(path.join(__dirname, '../views', 'index.html'));
};

exports.getData = async (req, res, next) => {

	try {
		const result = await json_file.readFile('./json/data1.json');
		res.status(200).json({ data: result });
	} catch (err) {
		console.log(err)
	}
	
};
