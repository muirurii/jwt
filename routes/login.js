const express = require('express');
const router = express.Router();
const logInController = require('../controllers/logInController');

router.post('/', logInController);

module.exports = router;