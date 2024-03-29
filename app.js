const multer = require('multer');
const express = require('express');
const path = require('path');
const cors = require('cors');
const file_routes = require('./routes/file');

const app = express();
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'files');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	}
});
const filter = (req, file, cb) => {
	if (!file.originalname.match(/\.(xls|xlsx)$/)) {
		return cb(new Error('Only xlsx document'));
	}
	cb(null, true);
};
app.use(multer({ storage: storage, fileFilter: filter }).single('file'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(file_routes);

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, 'views', '404.html'));
	// res.status(404).json({ msg: 'Endpoint not found!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`server listen on port ${PORT}`);
});
