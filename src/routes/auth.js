const express = require('express');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../files/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });
const auth_router = express.Router();
const auth_controller = require('../controllers/auth');

auth_router.post('/login', auth_controller.login);

auth_router.post('/register', auth_controller.register);

auth_router.post('/upload', upload.single('file'), auth_controller.uploadFile);

auth_router.post(
  '/upload-multiple',
  upload.array('files', 10),
  auth_controller.uploadMultipleFile
);

module.exports = auth_router;
