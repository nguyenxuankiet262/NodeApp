const express = require('express');

const auth_router = express.Router();
const auth_controller = require('../controllers/auth');

auth_router.post('/login', auth_controller.login);

auth_router.post('/register', auth_controller.register);

module.exports = auth_router;
