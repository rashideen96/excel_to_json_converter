const express = require('express');
const router = express.Router();

const file_controller = require('../controller/FileController');

router.post('/upload', file_controller.upload);
router.get('/', file_controller.index);
router.get('/data', file_controller.getData);

module.exports = router;
