const express = require('express');
const multer = require('multer');
const controller = require('../controllers/gdriveController');

const upload = multer();
const router = express.Router();

router.post('/upload', upload.single('file'), controller.uploadFile);
router.delete('/delete/:id', controller.deleteFile);
router.post('/bulk-delete', controller.bulkDeleteFiles);

module.exports = router;
