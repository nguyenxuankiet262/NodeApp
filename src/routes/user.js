const express = require('express');

const user_router = express.Router();
const user_controller = require('../controllers/user');

user_router.get('/', user_controller.getAll);

user_router.get('/search', user_controller.search);

user_router.post('/create', user_controller.create);

user_router.get('/:id', user_controller.findOne);

module.exports = user_router;
