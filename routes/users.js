const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');
const { authenticateToken } = require('../helpers');

router.route('/register').post(UsersController.register);

router.route('/login').post(UsersController.login);

router.route('/').get(authenticateToken, UsersController.getAllUsers);

module.exports = router;
